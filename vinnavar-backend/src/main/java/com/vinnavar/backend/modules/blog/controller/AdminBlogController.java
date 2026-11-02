package com.vinnavar.backend.modules.blog.controller;

import com.vinnavar.backend.modules.blog.dto.BlogPostRequest;
import com.vinnavar.backend.modules.blog.dto.BlogPostResponse;
import com.vinnavar.backend.modules.blog.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/blogs")
@RequiredArgsConstructor
public class AdminBlogController {

    private final BlogService blogService;

    @Value("${app.media.dir:media}")
    private String mediaDir;

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

    @PostMapping("/upload-video")
    public ResponseEntity<?> uploadBlogVideo(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Uploaded video file is empty"));
        }

        // Limit video file size to 100 MB
        if (file.getSize() > 100 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "Video file size must not exceed 100 MB"));
        }

        File videosFolder = new File(mediaDir, "videos");
        if (!videosFolder.exists()) {
            videosFolder.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String newFilename = "blog_vid_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path targetPath = Paths.get(videosFolder.getAbsolutePath(), newFilename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String videoUrl = "/media/videos/" + newFilename;
        return ResponseEntity.ok(Map.of("videoUrl", videoUrl));
    }
}
