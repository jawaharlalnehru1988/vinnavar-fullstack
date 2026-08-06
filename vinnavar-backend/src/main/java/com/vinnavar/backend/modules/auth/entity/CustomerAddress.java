package com.vinnavar.backend.modules.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerMobile;

    @Column(nullable = false)
    @Builder.Default
    private String addressType = "DELIVERY"; // "DELIVERY" or "BILLING"

    @Column(nullable = false)
    @Builder.Default
    private String title = "Home"; // e.g. Home, Office, Main Billing

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, length = 1000)
    private String streetAddress;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    @Builder.Default
    private String state = "Tamil Nadu";

    @Column(nullable = false)
    private String pincode;

    @Builder.Default
    private Boolean isDefault = false;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
