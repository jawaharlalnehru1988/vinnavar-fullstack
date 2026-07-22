package com.vinnavar.backend.modules.order.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingAddress {
    private String fullName;
    private String phone;
    private String streetAddress;
    private String city;
    private String state;
    private String pincode;
}
