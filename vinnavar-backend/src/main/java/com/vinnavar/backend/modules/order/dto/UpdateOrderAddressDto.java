package com.vinnavar.backend.modules.order.dto;

import com.vinnavar.backend.modules.order.entity.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderAddressDto {
    private ShippingAddress shippingAddress;
    private ShippingAddress billingAddress;
    private String gstin;
}
