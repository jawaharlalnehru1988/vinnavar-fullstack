package com.vinnavar.backend.modules.blog.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BlogPostResponse {
    private Long id;
    private String title;
    private String slug;
    private String category;
    private String content;
    private String shortDescription;
    private String imageUrl;
    private String author;
    private Integer readTimeMinutes;
    private Boolean featured;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
