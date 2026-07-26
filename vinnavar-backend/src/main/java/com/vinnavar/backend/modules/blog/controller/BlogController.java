package com.vinnavar.backend.modules.blog.controller;

import com.vinnavar.backend.modules.blog.dto.BlogPostResponse;
import com.vinnavar.backend.modules.blog.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<List<BlogPostResponse>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllActiveBlogs());
    }

    @GetMapping("/featured")
    public ResponseEntity<BlogPostResponse> getFeaturedBlog() {
        return ResponseEntity.ok(blogService.getFeaturedBlog());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(blogService.getBlogCategories());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<BlogPostResponse>> getBlogsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(blogService.getBlogsByCategory(category));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPostResponse> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }
}
