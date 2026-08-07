package com.vinnavar.backend.modules.order.entity;

import com.vinnavar.backend.modules.order.enums.OrderStatus;
import com.vinnavar.backend.modules.order.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    private String cartId;

    @Column(nullable = false)
    private String customerName;

    private String customerEmail;

    @Column(nullable = false)
    private String customerPhone;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "fullName", column = @Column(name = "shipping_full_name")),
        @AttributeOverride(name = "phone", column = @Column(name = "shipping_phone")),
        @AttributeOverride(name = "streetAddress", column = @Column(name = "shipping_street_address")),
        @AttributeOverride(name = "city", column = @Column(name = "shipping_city")),
        @AttributeOverride(name = "state", column = @Column(name = "shipping_state")),
        @AttributeOverride(name = "pincode", column = @Column(name = "shipping_pincode"))
    })
    private ShippingAddress shippingAddress;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "fullName", column = @Column(name = "billing_full_name")),
        @AttributeOverride(name = "phone", column = @Column(name = "billing_phone")),
        @AttributeOverride(name = "streetAddress", column = @Column(name = "billing_street_address")),
        @AttributeOverride(name = "city", column = @Column(name = "billing_city")),
        @AttributeOverride(name = "state", column = @Column(name = "billing_state")),
        @AttributeOverride(name = "pincode", column = @Column(name = "billing_pincode"))
    })
    private ShippingAddress billingAddress;

    private String gstin;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Getter(AccessLevel.NONE)
    private BigDecimal subtotal;

    @Getter(AccessLevel.NONE)
    private BigDecimal shippingFee;

    @Getter(AccessLevel.NONE)
    private BigDecimal gstTax;

    @Getter(AccessLevel.NONE)
    private Double totalWeightKg;

    public Double getTotalWeightKg() {
        if (totalWeightKg != null && totalWeightKg > 0) return totalWeightKg;
        if (items != null && !items.isEmpty()) {
            double calcWeight = items.stream()
                    .mapToDouble(item -> {
                        String name = item.getVariantName() != null ? item.getVariantName() : item.getProductName();
                        int qty = item.getQuantity() != null ? item.getQuantity() : 1;
                        return qty * com.vinnavar.backend.modules.cart.service.CartService.parseWeightInKg(name);
                    })
                    .sum();
            if (calcWeight > 0) return calcWeight;
        }
        return 0.5;
    }

    public BigDecimal getSubtotal() {
        if (subtotal != null) return subtotal;
        if (items != null && !items.isEmpty()) {
            return items.stream()
                    .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        if (totalAmount != null) return totalAmount;
        return BigDecimal.ZERO;
    }

    public BigDecimal getShippingFee() {
        if (shippingFee != null) return shippingFee;
        return new BigDecimal("48.00");
    }

    public BigDecimal getGstTax() {
        if (gstTax != null) return gstTax;
        return getSubtotal().multiply(new BigDecimal("0.05")).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.COD;

    @Builder.Default
    private String paymentStatus = "PENDING_COD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus orderStatus = OrderStatus.CONFIRMED;

    private String courierName;

    private String trackingNumber;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
