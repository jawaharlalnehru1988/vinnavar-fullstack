package com.vinnavar.backend.modules.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "category_name_translations", joinColumns = @JoinColumn(name = "category_id"))
    @MapKeyColumn(name = "lang_code")
    @Column(name = "translated_name")
    @Builder.Default
    private java.util.Map<String, String> nameTranslations = new java.util.HashMap<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "category_desc_translations", joinColumns = @JoinColumn(name = "category_id"))
    @MapKeyColumn(name = "lang_code")
    @Column(name = "translated_desc", columnDefinition = "TEXT")
    @Builder.Default
    private java.util.Map<String, String> descriptionTranslations = new java.util.HashMap<>();

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
