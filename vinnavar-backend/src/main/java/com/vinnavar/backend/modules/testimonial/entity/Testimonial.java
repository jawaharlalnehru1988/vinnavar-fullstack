package com.vinnavar.backend.modules.testimonial.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "testimonials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    private String customerLocation;

    @Column(nullable = false)
    @Builder.Default
    private Integer rating = 5;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reviewText;

    private String productName;

    private String avatarUrl;

    @Builder.Default
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
