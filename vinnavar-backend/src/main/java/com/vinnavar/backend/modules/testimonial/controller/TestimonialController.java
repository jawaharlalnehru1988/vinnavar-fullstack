package com.vinnavar.backend.modules.testimonial.controller;

import com.vinnavar.backend.modules.testimonial.entity.Testimonial;
import com.vinnavar.backend.modules.testimonial.service.TestimonialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialService testimonialService;

    // Public Endpoint - List Active Testimonials
    @GetMapping("/testimonials")
    public ResponseEntity<List<Testimonial>> getActiveTestimonials() {
        return ResponseEntity.ok(testimonialService.getActiveTestimonials());
    }

    // Admin Endpoints
    @GetMapping("/admin/testimonials")
    public ResponseEntity<List<Testimonial>> getAllTestimonialsForAdmin() {
        return ResponseEntity.ok(testimonialService.getAllTestimonialsForAdmin());
    }

    @PostMapping("/admin/testimonials")
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialService.createTestimonial(testimonial));
    }

    @PutMapping("/admin/testimonials/{id}")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable Long id, @RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialService.updateTestimonial(id, testimonial));
    }

    @DeleteMapping("/admin/testimonials/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        testimonialService.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }
}
