package com.vinnavar.backend.modules.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_payment_methods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerPaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerMobile;

    @Column(nullable = false)
    @Builder.Default
    private String paymentType = "CARD"; // "CARD", "UPI", "NET_BANKING", "COD"

    @Column(nullable = false)
    private String providerName; // e.g. HDFC Visa, GPay UPI, ICICI Bank

    @Column(nullable = false)
    private String accountIdentifier; // e.g. "**** 4321" or "user@okaxis"

    @Column(nullable = true)
    private String expiryInfo; // e.g. "10/2028"

    @Builder.Default
    private Boolean isDefault = false;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
