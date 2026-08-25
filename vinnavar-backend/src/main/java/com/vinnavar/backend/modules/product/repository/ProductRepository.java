package com.vinnavar.backend.modules.product.repository;

import com.vinnavar.backend.modules.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByActiveTrueOrderByDisplayOrderAscIdAsc();
    List<Product> findAllByOrderByDisplayOrderAscIdAsc();
    List<Product> findByFeaturedTrueAndActiveTrue();
    List<Product> findByFeaturedTrueAndActiveTrueOrderByDisplayOrderAscIdAsc();
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    List<Product> findByCategoryIdAndActiveTrueOrderByDisplayOrderAscIdAsc(Long categoryId);
    Optional<Product> findBySlug(String slug);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByCategoryIdOrderByDisplayOrderAscIdAsc(Long categoryId);
}
