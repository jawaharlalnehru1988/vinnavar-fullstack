package com.vinnavar.backend.modules.review.repository;

import com.vinnavar.backend.modules.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdAndStatusOrderByCreatedAtDesc(Long productId, String status);

    List<Review> findByStatusOrderByCreatedAtDesc(String status);

    List<Review> findByCustomerPhoneOrderByCreatedAtDesc(String customerPhone);

    List<Review> findByOrderNumberOrderByCreatedAtDesc(String orderNumber);

    List<Review> findAllByOrderByCreatedAtDesc();

    long countByProductIdAndStatus(Long productId, String status);
    
    void deleteByProductId(Long productId);
}
