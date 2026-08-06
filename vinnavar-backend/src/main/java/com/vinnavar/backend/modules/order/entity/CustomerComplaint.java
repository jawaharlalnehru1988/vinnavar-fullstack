package com.vinnavar.backend.modules.order.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerMobile;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String orderNumber;

    @Column(nullable = true)
    private String productName;

    @Column(nullable = false)
    private String issueType; // e.g. "DAMAGED_PRODUCT", "QUALITY_CONCERN", "WRONG_ITEM", "OTHER"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // "PENDING", "IN_REVIEW", "RESOLVED", "REJECTED"

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    @Builder.Default
    private Boolean refundPolicyAccepted = true;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
