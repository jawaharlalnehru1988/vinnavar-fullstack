package com.vinnavar.backend.modules.blog.controller;

import com.vinnavar.backend.modules.blog.dto.BlogPostRequest;
import com.vinnavar.backend.modules.blog.dto.BlogPostResponse;
import com.vinnavar.backend.modules.blog.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/blogs")
@RequiredArgsConstructor
public class AdminBlogController {

    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<List<BlogPostResponse>> getAllBlogsAdmin() {
        return ResponseEntity.ok(blogService.getAllBlogsAdmin());
    }

    @PostMapping
    public ResponseEntity<BlogPostResponse> createBlog(@Valid @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(blogService.createBlog(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostResponse> updateBlog(@PathVariable Long id, @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(blogService.updateBlog(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }
}
