package com.vinnavar.backend.modules.blog.repository;

import com.vinnavar.backend.modules.blog.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByActiveTrueOrderByCreatedAtDesc();

    List<BlogPost> findByCategoryIgnoreCaseAndActiveTrueOrderByCreatedAtDesc(String category);

    Optional<BlogPost> findBySlugAndActiveTrue(String slug);

    Optional<BlogPost> findBySlug(String slug);

    List<BlogPost> findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT b.category FROM BlogPost b WHERE b.active = true")
    List<String> findDistinctCategories();
}
