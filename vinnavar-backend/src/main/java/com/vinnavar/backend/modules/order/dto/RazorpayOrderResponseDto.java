package com.vinnavar.backend.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderResponseDto {
    private String orderNumber;
    private String razorpayOrderId;
    private BigDecimal amount;
    private Integer amountInPaise;
    private String currency;
    private String keyId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}
