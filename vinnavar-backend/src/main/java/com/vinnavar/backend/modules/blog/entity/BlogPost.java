package com.vinnavar.backend.modules.blog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    private String imageUrl;

    @Builder.Default
    private String author = "Vinnavar Team";

    @Builder.Default
    private Integer readTimeMinutes = 5;

    @Builder.Default
    private Boolean featured = false;

    @Builder.Default
    private Boolean active = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "blog_title_translations", joinColumns = @JoinColumn(name = "blog_id"))
    @MapKeyColumn(name = "lang_code")
    @Column(name = "translated_title")
    @Builder.Default
    private Map<String, String> titleTranslations = new HashMap<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "blog_desc_translations", joinColumns = @JoinColumn(name = "blog_id"))
    @MapKeyColumn(name = "lang_code")
    @Column(name = "translated_desc", columnDefinition = "TEXT")
    @Builder.Default
    private Map<String, String> shortDescriptionTranslations = new HashMap<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "blog_content_translations", joinColumns = @JoinColumn(name = "blog_id"))
    @MapKeyColumn(name = "lang_code")
    @Column(name = "translated_content", columnDefinition = "TEXT")
    @Builder.Default
    private Map<String, String> contentTranslations = new HashMap<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
