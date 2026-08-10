package com.vinnavar.backend.modules.review.controller;

import com.vinnavar.backend.modules.review.entity.Review;
import com.vinnavar.backend.modules.review.service.ReviewService;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Value("${app.media.dir:/var/www/vinnavar-fullstack/vinnavar-backend/media}")
    private String mediaDir;

    @PostMapping("/reviews")
    public ResponseEntity<Review> submitReview(@RequestBody Review review) {
        Review created = reviewService.createReview(review);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/reviews/upload-image")
    public ResponseEntity<?> uploadReviewImage(@RequestParam("file") MultipartFile file) {
        return handleImageUpload(file);
    }

    @PostMapping("/reviews/upload-images")
    public ResponseEntity<?> uploadReviewImages(@RequestParam("files") List<MultipartFile> files) {
        List<String> imageUrls = files.stream()
            .map(this::handleImageUpload)
            .filter(response -> response.getStatusCode().is2xxSuccessful())
            .map(response -> (Map<String, String>) response.getBody())
            .map(body -> body.get("imageUrl"))
            .toList();
        return ResponseEntity.ok(Map.of("imageUrls", imageUrls));
    }

    private ResponseEntity<?> handleImageUpload(MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Uploaded file is empty"));
        }

        if (file.getSize() > 5 * 1024 * 1024) { // 5 MB limit for customer photos
            return ResponseEntity.badRequest().body(Map.of("error", "Image file size must not exceed 5 MB"));
        }

        try {
            File reviewsFolder = new File(mediaDir, "reviews");
            if (!reviewsFolder.exists()) {
                reviewsFolder.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = "rev_" + UUID.randomUUID().toString().substring(0, 10) + extension;
            Path targetPath = Paths.get(reviewsFolder.getAbsolutePath(), newFilename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String relativeUrl = "/media/reviews/" + newFilename;
            return ResponseEntity.ok(Map.of("imageUrl", relativeUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to save review image: " + e.getMessage()));
        }
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review review) {
        Review updated = reviewService.updateReview(id, review);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/reviews/product/{productId}")
    public ResponseEntity<Map<String, Object>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getApprovedProductReviews(productId);
        Map<String, Object> stats = reviewService.getProductReviewStats(productId);
        stats.put("reviews", reviews);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/reviews/user")
    public ResponseEntity<List<Review>> getUserReviews(@RequestParam String phone) {
        return ResponseEntity.ok(reviewService.getUserReviews(phone));
    }

    @GetMapping("/admin/reviews")
    public ResponseEntity<List<Review>> getAllAdminReviews() {
        return ResponseEntity.ok(reviewService.getAllAdminReviews());
    }

    @PutMapping("/admin/reviews/{id}/status")
    public ResponseEntity<Review> updateReviewStatus(@PathVariable Long id, @RequestParam String status) {
        Review updated = reviewService.updateReviewStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/admin/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
