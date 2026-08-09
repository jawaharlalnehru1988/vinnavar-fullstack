package com.vinnavar.backend.modules.testimonial.service;

import com.vinnavar.backend.modules.testimonial.entity.Testimonial;
import com.vinnavar.backend.modules.testimonial.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vinnavar.backend.modules.review.entity.Review;
import com.vinnavar.backend.modules.review.repository.ReviewRepository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;
    private final ReviewRepository reviewRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedDefaultTestimonials() {
        if (testimonialRepository.count() == 0) {
            List<Testimonial> defaults = List.of(
                Testimonial.builder()
                    .customerName("Kavitha R.")
                    .customerLocation("Chennai, Tamil Nadu")
                    .rating(5)
                    .reviewText("The Traditional Poongar Rice has transformed our family's health! 100% authentic, unpolished, and packed with traditional nutrition.")
                    .productName("Traditional Poongar Rice")
                    .active(true)
                    .build(),
                Testimonial.builder()
                    .customerName("Rajesh Kumar")
                    .customerLocation("Coimbatore, Tamil Nadu")
                    .rating(5)
                    .reviewText("Cold-pressed Groundnut Oil tastes just like my grandmother's traditional wooden ghani oil. Exceptional purity and natural aroma!")
                    .productName("Wood-Pressed Groundnut Oil")
                    .active(true)
                    .build(),
                Testimonial.builder()
                    .customerName("Sangeetha V.")
                    .customerLocation("Madurai, Tamil Nadu")
                    .rating(5)
                    .reviewText("Super fast delivery and top quality A2 Desi Cow Ghee. Rich natural aroma and taste. Vinnavar Organics is my trusted choice!")
                    .productName("Pure A2 Desi Cow Ghee")
                    .active(true)
                    .build(),
                Testimonial.builder()
                    .customerName("Dr. Arvind Swamy")
                    .customerLocation("Bengaluru, Karnataka")
                    .rating(5)
                    .reviewText("As a healthcare professional, I strictly recommend organic Mappillai Samba rice for stamina and vitality. Fresh, pure, and authentic.")
                    .productName("Organic Mappillai Samba Rice")
                    .active(true)
                    .build(),
                Testimonial.builder()
                    .customerName("Anitha Sundaram")
                    .customerLocation("Tiruchirappalli, Tamil Nadu")
                    .rating(5)
                    .reviewText("The Wild Forest Honey is pure perfection. Authentic aroma, 100% natural, and zero added sugar. Highly recommended!")
                    .productName("Raw Wild Forest Honey")
                    .active(true)
                    .build()
            );
            testimonialRepository.saveAll(defaults);
        }
    }

    public List<Testimonial> getActiveTestimonials() {
        List<Testimonial> testimonials = new ArrayList<>(testimonialRepository.findByActiveTrueOrderByCreatedAtDesc());

        List<Review> approvedReviews = reviewRepository.findByStatusOrderByCreatedAtDesc("APPROVED");
        for (Review r : approvedReviews) {
            String text = (r.getReviewComment() != null && !r.getReviewComment().isBlank())
                    ? r.getReviewComment()
                    : (r.getReviewTitle() != null ? r.getReviewTitle() : "Great organic product!");

            Testimonial t = Testimonial.builder()
                    .id(r.getId() + 100000L)
                    .customerName(r.getCustomerName() != null ? r.getCustomerName() : "Valued Customer")
                    .customerLocation((r.getCustomerLocation() != null && !r.getCustomerLocation().isBlank()) ? r.getCustomerLocation() : "India")
                    .rating(r.getRating() != null ? r.getRating() : 5)
                    .reviewText(text)
                    .productName(r.getProductName() != null ? r.getProductName() : "Organic Specialty")
                    .avatarUrl(r.getImageUrl())
                    .active(true)
                    .createdAt(r.getCreatedAt() != null ? r.getCreatedAt() : java.time.LocalDateTime.now())
                    .build();
            testimonials.add(t);
        }

        testimonials.sort((t1, t2) -> {
            if (t1.getCreatedAt() == null && t2.getCreatedAt() == null) return 0;
            if (t1.getCreatedAt() == null) return 1;
            if (t2.getCreatedAt() == null) return -1;
            return t2.getCreatedAt().compareTo(t1.getCreatedAt());
        });
        return testimonials;
    }

    public List<Testimonial> getAllTestimonialsForAdmin() {
        return testimonialRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Testimonial createTestimonial(Testimonial testimonial) {
        if (testimonial.getCustomerName() == null || testimonial.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required");
        }
        if (testimonial.getReviewText() == null || testimonial.getReviewText().trim().isEmpty()) {
            throw new IllegalArgumentException("Review text is required");
        }
        if (testimonial.getRating() == null || testimonial.getRating() < 1 || testimonial.getRating() > 5) {
            testimonial.setRating(5);
        }
        return testimonialRepository.save(testimonial);
    }

    @Transactional
    public Testimonial updateTestimonial(Long id, Testimonial updated) {
        Testimonial existing = testimonialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Testimonial not found with ID: " + id));

        if (updated.getCustomerName() != null && !updated.getCustomerName().trim().isEmpty()) {
            existing.setCustomerName(updated.getCustomerName().trim());
        }
        if (updated.getCustomerLocation() != null) {
            existing.setCustomerLocation(updated.getCustomerLocation().trim());
        }
        if (updated.getRating() != null && updated.getRating() >= 1 && updated.getRating() <= 5) {
            existing.setRating(updated.getRating());
        }
        if (updated.getReviewText() != null && !updated.getReviewText().trim().isEmpty()) {
            existing.setReviewText(updated.getReviewText().trim());
        }
        if (updated.getProductName() != null) {
            existing.setProductName(updated.getProductName().trim());
        }
        if (updated.getAvatarUrl() != null) {
            existing.setAvatarUrl(updated.getAvatarUrl().trim());
        }
        if (updated.getActive() != null) {
            existing.setActive(updated.getActive());
        }

        return testimonialRepository.save(existing);
    }

    @Transactional
    public void deleteTestimonial(Long id) {
        if (!testimonialRepository.existsById(id)) {
            throw new IllegalArgumentException("Testimonial not found with ID: " + id);
        }
        testimonialRepository.deleteById(id);
    }
}
