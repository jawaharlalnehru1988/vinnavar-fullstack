package com.vinnavar.backend.modules.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String fullDescription;

    private String imageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    private String videoUrl;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_name_translations", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "lang_code")
    @Column(name = "translated_name")
    @Builder.Default
    private java.util.Map<String, String> nameTranslations = new java.util.HashMap<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_desc_translations", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "lang_code")
    @Column(name = "translated_desc", columnDefinition = "TEXT")
    @Builder.Default
    private java.util.Map<String, String> descriptionTranslations = new java.util.HashMap<>();

    @Builder.Default
    private String hsnCode = "1006";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
