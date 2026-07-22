package com.vinnavar.backend.modules.product.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(nullable = false)
    private String variantName; // e.g. "500 ml", "1 Liter", "1 kg"

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal discountPrice;

    @Builder.Default
    private Integer stockQuantity = 100;

    @Builder.Default
    private boolean isDefault = false;
}
