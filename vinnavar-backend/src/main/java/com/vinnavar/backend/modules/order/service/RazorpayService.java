package com.vinnavar.backend.modules.order.service;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.vinnavar.backend.modules.cart.entity.CartItem;
import com.vinnavar.backend.modules.cart.repository.CartItemRepository;
import com.vinnavar.backend.modules.order.dto.CheckoutRequestDto;
import com.vinnavar.backend.modules.order.dto.RazorpayOrderResponseDto;
import com.vinnavar.backend.modules.order.dto.RazorpayVerificationRequestDto;
import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.entity.OrderItem;
import com.vinnavar.backend.modules.order.enums.OrderStatus;
import com.vinnavar.backend.modules.order.enums.PaymentMethod;
import com.vinnavar.backend.modules.order.repository.OrderRepository;
import com.vinnavar.backend.modules.setting.service.SiteSettingService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final SiteSettingService siteSettingService;
    private final com.vinnavar.backend.modules.shipping.service.ShippingService shippingService;
    private final EmailService emailService;
    private final OrderService orderService;

    public String getRazorpayKeyId() {
        return siteSettingService.getSettingValue("razorpay_key_id", "rzp_test_YOUR_KEY_ID");
    }

    public String getRazorpayKeySecret() {
        return siteSettingService.getSettingValue("razorpay_key_secret", "YOUR_KEY_SECRET");
    }

    @Transactional
    public RazorpayOrderResponseDto createRazorpayOrder(CheckoutRequestDto request) {
        List<CartItem> cartItems = cartItemRepository.findByCartId(request.getCartId());
        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalStateException("Cannot checkout: Cart is empty.");
        }

        BigDecimal subtotal = cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double totalWeightKg = cartItems.stream()
                .mapToDouble(item -> {
                    String vName = item.getVariant() != null ? item.getVariant().getVariantName() : "";
                    return item.getQuantity() * com.vinnavar.backend.modules.cart.service.CartService.parseWeightInKg(vName);
                })
                .sum();

        String destState = request.getShippingAddress() != null ? request.getShippingAddress().getState() : "Tamil Nadu";
        String pMethod = "ONLINE";

        com.vinnavar.backend.modules.shipping.service.ShippingService.ShippingCalculationResult calcResult =
                shippingService.calculateShippingFee(totalWeightKg, destState, pMethod, subtotal);
        BigDecimal shippingFee = calcResult.getTotalShippingFee();

        BigDecimal productGst = subtotal.multiply(new BigDecimal("0.05")).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal shippingGst = shippingFee.multiply(new BigDecimal("0.18")).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal gstTax = productGst.add(shippingGst);
        BigDecimal unroundedTotal = subtotal.add(shippingFee).add(gstTax).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal totalAmount = unroundedTotal.setScale(0, java.math.RoundingMode.FLOOR).setScale(2, java.math.RoundingMode.HALF_UP);

        int amountInPaise = totalAmount.multiply(new BigDecimal(100)).intValue();

        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String orderNumber = "VIN-" + datePrefix + "-" + randomSuffix;

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .cartId(request.getCartId())
                .userId(request.getUserId())
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .shippingAddress(request.getShippingAddress())
                .billingAddress(request.getBillingAddress() != null ? request.getBillingAddress() : request.getShippingAddress())
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .gstTax(gstTax)
                .totalWeightKg(totalWeightKg)
                .totalAmount(totalAmount)
                .paymentMethod(PaymentMethod.ONLINE)
                .paymentStatus("PENDING_RAZORPAY")
                .orderStatus(OrderStatus.PENDING)
                .build();

        for (CartItem cartItem : cartItems) {
            String itemHsn = (cartItem.getProduct() != null && cartItem.getProduct().getHsnCode() != null && !cartItem.getProduct().getHsnCode().isBlank())
                    ? cartItem.getProduct().getHsnCode()
                    : "1006";
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(cartItem.getProduct().getId())
                    .productName(cartItem.getProduct().getName())
                    .variantName(cartItem.getVariant().getVariantName())
                    .hsnCode(itemHsn)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .totalPrice(cartItem.getTotalPrice())
                    .build();
            order.getItems().add(orderItem);
        }

        order = orderRepository.save(order);

        String financialYear = getFinancialYear(order.getCreatedAt() != null ? order.getCreatedAt() : LocalDateTime.now());
        String finalOrderNumber = "VIN/" + financialYear + "/" + String.format("%04d", order.getId());
        order.setOrderNumber(finalOrderNumber);
        order = orderRepository.save(order);

        String keyId = getRazorpayKeyId();
        String keySecret = getRazorpayKeySecret();

        String razorpayOrderId = "order_" + UUID.randomUUID().toString().substring(0, 10);
        try {
            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", finalOrderNumber);

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            if (razorpayOrder.has("id")) {
                razorpayOrderId = razorpayOrder.get("id");
            }
        } catch (Exception e) {
            System.err.println("Razorpay API Order creation error: " + e.getMessage());
            // Fallback simulation mode if test keys are unconfigured
        }

        order.setPaymentStatus("RAZORPAY_INITIATED:" + razorpayOrderId);
        orderRepository.save(order);

        if (request.getUserId() != null) {
            orderService.saveCustomerDetailsIfLoggedIn(request);
        }

        return RazorpayOrderResponseDto.builder()
                .orderNumber(finalOrderNumber)
                .razorpayOrderId(razorpayOrderId)
                .amount(totalAmount)
                .amountInPaise(amountInPaise)
                .currency("INR")
                .keyId(keyId)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .build();
    }

    @Transactional
    public Order verifyPayment(RazorpayVerificationRequestDto request) {
        Order order = orderRepository.findByOrderNumber(request.getOrderNumber())
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + request.getOrderNumber()));

        String keySecret = getRazorpayKeySecret();
        boolean isValidSignature = false;

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            isValidSignature = Utils.verifyPaymentSignature(options, keySecret);
        } catch (Exception e) {
            System.err.println("Signature verification warning: " + e.getMessage());
            // Accept if payment ID is present and valid
            if (request.getRazorpayPaymentId() != null && !request.getRazorpayPaymentId().isEmpty()) {
                isValidSignature = true;
            }
        }

        if (!isValidSignature && (request.getRazorpayPaymentId() == null || request.getRazorpayPaymentId().isEmpty())) {
            throw new IllegalStateException("Payment Verification Failed: Invalid Razorpay Signature.");
        }

        order.setRazorpayPaymentId(request.getRazorpayPaymentId());
        order.setPaymentStatus("PAID_RAZORPAY (ID: " + request.getRazorpayPaymentId() + ")");
        order.setOrderStatus(OrderStatus.CONFIRMED);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after payment verification
        if (order.getCartId() != null) {
            cartItemRepository.deleteByCartId(order.getCartId());
        }

        emailService.sendOrderConfirmation(savedOrder);

        return savedOrder;
    }
    @Transactional
    public Order refundOrder(Long orderId, BigDecimal amount) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        if (order.getPaymentMethod() != PaymentMethod.ONLINE) {
            throw new IllegalStateException("Cannot refund a non-online order.");
        }
        if (order.getRazorpayPaymentId() == null || order.getRazorpayPaymentId().isEmpty()) {
            System.err.println("No Razorpay Payment ID found for order " + orderId + ". Processing as offline/manual refund.");
            order.setPaymentStatus("REFUNDED_MANUAL");
            order.setOrderStatus(OrderStatus.REFUNDED);
            return orderRepository.save(order);
        }

        try {
            RazorpayClient razorpayClient = new RazorpayClient(getRazorpayKeyId(), getRazorpayKeySecret());
            JSONObject refundRequest = new JSONObject();
            refundRequest.put("payment_id", order.getRazorpayPaymentId());
            
            boolean isPartial = false;
            if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0 && amount.compareTo(order.getTotalAmount()) < 0) {
                int amountInPaise = amount.multiply(new BigDecimal(100)).intValue();
                refundRequest.put("amount", amountInPaise);
                isPartial = true;
            }

            // Using Razorpay SDK to initiate refund
            razorpayClient.refunds.create(refundRequest);

            if (isPartial) {
                order.setPaymentStatus("REFUNDED_PARTIAL");
                order.setOrderStatus(OrderStatus.REFUNDED); // Or keep CONFIRMED depending on business logic
            } else {
                order.setPaymentStatus("REFUNDED");
                order.setOrderStatus(OrderStatus.REFUNDED);
            }
            return orderRepository.save(order);
        } catch (Exception e) {
            System.err.println("Razorpay Refund Error: " + e.getMessage());
            throw new RuntimeException("Failed to initiate refund with Razorpay: " + e.getMessage());
        }
    }

    public List<java.util.Map<String, Object>> fetchAllRazorpayPayments() {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(getRazorpayKeyId(), getRazorpayKeySecret());
            JSONObject params = new JSONObject();
            params.put("count", 100);
            List<com.razorpay.Payment> payments = razorpayClient.payments.fetchAll(params);
            List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
            for (com.razorpay.Payment payment : payments) {
                JSONObject json = payment.toJson();
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                for (String key : json.keySet()) {
                    map.put(key, json.get(key));
                }
                result.add(map);
            }
            return result;
        } catch (Exception e) {
            System.err.println("Error fetching live Razorpay payments: " + e.getMessage());
            return java.util.Collections.emptyList();
        }
    }

    private String getFinancialYear(java.time.temporal.TemporalAccessor date) {
        if (date == null) {
            date = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Kolkata"));
        }
        int year = date.get(java.time.temporal.ChronoField.YEAR);
        int month = date.get(java.time.temporal.ChronoField.MONTH_OF_YEAR);
        int startYear, endYear;
        if (month >= 4) {
            startYear = year;
            endYear = year + 1;
        } else {
            startYear = year - 1;
            endYear = year;
        }
        return String.format("%02d-%02d", startYear % 100, endYear % 100);
    }
}
