package com.vinnavar.backend.modules.order.service;

import com.vinnavar.backend.modules.cart.entity.CartItem;
import com.vinnavar.backend.modules.cart.repository.CartItemRepository;
import com.vinnavar.backend.modules.order.dto.CheckoutRequestDto;
import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.entity.OrderItem;
import com.vinnavar.backend.modules.order.enums.OrderStatus;
import com.vinnavar.backend.modules.order.enums.PaymentMethod;
import com.vinnavar.backend.modules.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final com.vinnavar.backend.modules.shipping.service.ShippingService shippingService;

    @Transactional
    public Order processCheckout(CheckoutRequestDto request) {
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
        String pMethod = request.getPaymentMethod() != null ? request.getPaymentMethod().name() : "COD";

        com.vinnavar.backend.modules.shipping.service.ShippingService.ShippingCalculationResult calcResult =
                shippingService.calculateShippingFee(totalWeightKg, destState, pMethod, subtotal);
        BigDecimal shippingFee = calcResult.getTotalShippingFee();

        BigDecimal productGst = subtotal.multiply(new BigDecimal("0.05")).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal shippingGst = shippingFee.multiply(new BigDecimal("0.18")).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal gstTax = productGst.add(shippingGst);
        BigDecimal unroundedTotal = subtotal.add(shippingFee).add(gstTax).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal totalAmount = unroundedTotal.setScale(0, java.math.RoundingMode.FLOOR).setScale(2, java.math.RoundingMode.HALF_UP);

        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String orderNumber = "VIN-" + datePrefix + "-" + randomSuffix;

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .cartId(request.getCartId())
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .shippingAddress(request.getShippingAddress())
                .billingAddress(request.getBillingAddress() != null ? request.getBillingAddress() : request.getShippingAddress())
                .gstin(request.getGstin())
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .gstTax(gstTax)
                .totalWeightKg(totalWeightKg)
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.COD)
                .paymentStatus("PENDING_COD")
                .orderStatus(OrderStatus.CONFIRMED)
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

        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful checkout
        cartItemRepository.deleteByCartId(request.getCartId());

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setOrderStatus(status);
        if (status == OrderStatus.DELIVERED) {
            order.setPaymentStatus("PAID_COD");
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderTracking(Long orderId, String courierName, String trackingNumber) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setCourierName(courierName);
        order.setTrackingNumber(trackingNumber);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderAddress(Long orderId, com.vinnavar.backend.modules.order.dto.UpdateOrderAddressDto request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (request.getShippingAddress() != null) {
            order.setShippingAddress(request.getShippingAddress());
        }
        if (request.getBillingAddress() != null) {
            order.setBillingAddress(request.getBillingAddress());
        }
        if (request.getGstin() != null) {
            order.setGstin(request.getGstin());
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderDetails(Long orderId, com.vinnavar.backend.modules.order.dto.UpdateOrderDto dto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (dto.getOrderStatus() != null) order.setOrderStatus(dto.getOrderStatus());
        if (dto.getPaymentMethod() != null) order.setPaymentMethod(dto.getPaymentMethod());
        if (dto.getPaymentStatus() != null) order.setPaymentStatus(dto.getPaymentStatus());
        if (dto.getCourierName() != null) order.setCourierName(dto.getCourierName());
        if (dto.getTrackingNumber() != null) order.setTrackingNumber(dto.getTrackingNumber());
        if (dto.getCustomerName() != null) order.setCustomerName(dto.getCustomerName());
        if (dto.getCustomerPhone() != null) order.setCustomerPhone(dto.getCustomerPhone());
        if (dto.getCustomerEmail() != null) order.setCustomerEmail(dto.getCustomerEmail());
        if (dto.getTotalAmount() != null) order.setTotalAmount(dto.getTotalAmount());
        if (dto.getShippingFee() != null) {
            BigDecimal oldFee = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;
            BigDecimal newFee = dto.getShippingFee();
            order.setShippingFee(newFee);
            if (dto.getTotalAmount() == null && order.getTotalAmount() != null) {
                BigDecimal diff = newFee.subtract(oldFee);
                order.setTotalAmount(order.getTotalAmount().add(diff));
            }
        }
        if (dto.getShippingAddress() != null) order.setShippingAddress(dto.getShippingAddress());
        if (dto.getGstin() != null) order.setGstin(dto.getGstin());
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderShippingFee(Long orderId, BigDecimal shippingFee) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        BigDecimal oldFee = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;
        BigDecimal newFee = shippingFee != null ? shippingFee : BigDecimal.ZERO;
        order.setShippingFee(newFee);

        if (order.getTotalAmount() != null) {
            BigDecimal diff = newFee.subtract(oldFee);
            order.setTotalAmount(order.getTotalAmount().add(diff));
        }
        return orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        orderRepository.delete(order);
    }
    @Transactional
    public Order requestCancellation(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (order.getOrderStatus() == OrderStatus.DELIVERED || order.getOrderStatus() == OrderStatus.CANCELLED || order.getOrderStatus() == OrderStatus.REFUNDED) {
            throw new IllegalStateException("Cannot cancel an order that is already delivered, cancelled, or refunded.");
        }
        order.setOrderStatus(OrderStatus.CANCELLATION_REQUESTED);
        return orderRepository.save(order);
    }
}
