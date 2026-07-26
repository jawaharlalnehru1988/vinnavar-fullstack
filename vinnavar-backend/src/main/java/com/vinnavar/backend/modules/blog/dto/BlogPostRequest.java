package com.vinnavar.backend.modules.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlogPostRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Content is required")
    private String content;

    private String shortDescription;
    private String imageUrl;
    private String author;
    private Integer readTimeMinutes;
    private Boolean featured;
    private Boolean active;
}
