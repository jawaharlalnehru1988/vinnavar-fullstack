package com.vinnavar.backend.modules.review.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    private String productName;

    @Column(nullable = false)
    private String customerName;

    private String customerEmail;

    private String customerPhone;

    private String orderNumber;

    @Column(nullable = false)
    @Builder.Default
    private Integer rating = 5;

    private String reviewTitle;

    @Column(columnDefinition = "TEXT")
    private String reviewComment;

    private String imageUrl;

    @Builder.Default
    private Boolean verifiedPurchase = false;

    @Column(nullable = false)
    @Builder.Default
    private String status = "APPROVED"; // APPROVED, PENDING, HIDDEN

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
