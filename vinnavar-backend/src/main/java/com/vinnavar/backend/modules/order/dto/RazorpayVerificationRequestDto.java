package com.vinnavar.backend.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayVerificationRequestDto {
    private String orderNumber;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
}
