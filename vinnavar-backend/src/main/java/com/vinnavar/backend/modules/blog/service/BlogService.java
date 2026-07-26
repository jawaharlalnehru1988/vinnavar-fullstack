package com.vinnavar.backend.modules.blog.service;

import com.vinnavar.backend.modules.blog.dto.BlogPostRequest;
import com.vinnavar.backend.modules.blog.dto.BlogPostResponse;

import java.util.List;

public interface BlogService {
    List<BlogPostResponse> getAllActiveBlogs();
    List<BlogPostResponse> getBlogsByCategory(String category);
    BlogPostResponse getBlogBySlug(String slug);
    BlogPostResponse getFeaturedBlog();
    List<String> getBlogCategories();

    // Admin CRUD
    List<BlogPostResponse> getAllBlogsAdmin();
    BlogPostResponse createBlog(BlogPostRequest request);
    BlogPostResponse updateBlog(Long id, BlogPostRequest request);
    void deleteBlog(Long id);
}
