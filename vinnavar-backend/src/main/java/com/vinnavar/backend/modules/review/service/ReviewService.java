package com.vinnavar.backend.modules.review.service;

import com.vinnavar.backend.modules.review.entity.Review;
import com.vinnavar.backend.modules.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Transactional
    public Review createReview(Review review) {
        if (review.getRating() == null || review.getRating() < 1) {
            review.setRating(5);
        } else if (review.getRating() > 5) {
            review.setRating(5);
        }

        if (review.getStatus() == null || review.getStatus().isBlank()) {
            review.setStatus("APPROVED");
        }

        if (review.getCustomerLocation() == null || review.getCustomerLocation().isBlank()) {
            review.setCustomerLocation("India");
        }

        review.setCreatedAt(LocalDateTime.now());
        Review saved = reviewRepository.save(review);
        log.info("Created new product review ID {} for product ID {}", saved.getId(), saved.getProductId());
        return saved;
    }

    public List<Review> getApprovedProductReviews(Long productId) {
        return reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, "APPROVED");
    }

    public Map<String, Object> getProductReviewStats(Long productId) {
        List<Review> approved = getApprovedProductReviews(productId);
        int totalCount = approved.size();

        double avgRating = 0.0;
        Map<Integer, Integer> countsPerStar = new HashMap<>();
        for (int i = 1; i <= 5; i++) countsPerStar.put(i, 0);

        if (totalCount > 0) {
            int sum = 0;
            for (Review r : approved) {
                int star = (r.getRating() != null && r.getRating() >= 1 && r.getRating() <= 5) ? r.getRating() : 5;
                countsPerStar.put(star, countsPerStar.get(star) + 1);
                sum += star;
            }
            avgRating = Math.round(((double) sum / totalCount) * 10.0) / 10.0;
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReviews", totalCount);
        stats.put("averageRating", avgRating > 0 ? avgRating : 5.0);
        stats.put("ratingBreakdown", countsPerStar);
        return stats;
    }

    public List<Review> getUserReviews(String customerPhone) {
        if (customerPhone == null || customerPhone.isBlank()) return List.of();
        return reviewRepository.findByCustomerPhoneOrderByCreatedAtDesc(customerPhone.trim());
    }

    public List<Review> getAllAdminReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Review updateReviewStatus(Long id, String status) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with ID: " + id));
        review.setStatus(status != null ? status.toUpperCase().trim() : "APPROVED");
        return reviewRepository.save(review);
    }

    @Transactional
    public Review updateReview(Long id, Review reviewDetails) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with ID: " + id));

        if (reviewDetails.getRating() != null) review.setRating(reviewDetails.getRating());
        if (reviewDetails.getReviewTitle() != null) review.setReviewTitle(reviewDetails.getReviewTitle());
        if (reviewDetails.getReviewComment() != null) review.setReviewComment(reviewDetails.getReviewComment());
        if (reviewDetails.getCustomerName() != null) review.setCustomerName(reviewDetails.getCustomerName());
        if (reviewDetails.getCustomerLocation() != null) review.setCustomerLocation(reviewDetails.getCustomerLocation());
        if (reviewDetails.getCustomerPhone() != null) review.setCustomerPhone(reviewDetails.getCustomerPhone());
        
        // Ensure backward compatibility and multiple image support
        if (reviewDetails.getImageUrl() != null && !reviewDetails.getImageUrl().isEmpty()) {
            review.setImageUrl(reviewDetails.getImageUrl());
        }
        if (reviewDetails.getImageUrls() != null && !reviewDetails.getImageUrls().isEmpty()) {
            review.setImageUrls(reviewDetails.getImageUrls());
        }

        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
