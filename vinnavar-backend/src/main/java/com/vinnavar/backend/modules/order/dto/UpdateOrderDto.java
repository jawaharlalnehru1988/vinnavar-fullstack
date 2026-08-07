package com.vinnavar.backend.modules.order.dto;

import com.vinnavar.backend.modules.order.entity.ShippingAddress;
import com.vinnavar.backend.modules.order.enums.OrderStatus;
import com.vinnavar.backend.modules.order.enums.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateOrderDto {
    private OrderStatus orderStatus;
    private PaymentMethod paymentMethod;
    private String paymentStatus;
    private String courierName;
    private String trackingNumber;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private ShippingAddress shippingAddress;
    private String gstin;
}
