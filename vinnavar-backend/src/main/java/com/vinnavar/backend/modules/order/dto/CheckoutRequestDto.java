package com.vinnavar.backend.modules.order.dto;

import com.vinnavar.backend.modules.order.entity.ShippingAddress;
import com.vinnavar.backend.modules.order.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequestDto {
    private String cartId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private ShippingAddress shippingAddress;
    private ShippingAddress billingAddress;
    private String gstin;
    private PaymentMethod paymentMethod = PaymentMethod.COD;
}
