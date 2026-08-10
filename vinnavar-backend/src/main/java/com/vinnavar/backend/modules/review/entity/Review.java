package com.vinnavar.backend.modules.review.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    private String customerLocation;

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @Builder.Default
    private Boolean verifiedPurchase = false;

    @Column(nullable = false)
    @Builder.Default
    private String status = "APPROVED"; // APPROVED, PENDING, HIDDEN

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
