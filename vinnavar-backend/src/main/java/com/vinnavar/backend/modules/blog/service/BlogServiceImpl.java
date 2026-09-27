package com.vinnavar.backend.modules.blog.service;

import com.vinnavar.backend.modules.blog.dto.BlogPostRequest;
import com.vinnavar.backend.modules.blog.dto.BlogPostResponse;
import com.vinnavar.backend.modules.blog.entity.BlogPost;
import com.vinnavar.backend.modules.blog.repository.BlogPostRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogPostRepository repository;

    @PostConstruct
    public void seedInitialBlogs() {
        // Auto-seeding disabled to prevent dummy/irrelevant blogs from being recreated.
        // Blog articles can be created via the Admin panel or API.
    }

    @Override
    public List<BlogPostResponse> getAllActiveBlogs() {
        return repository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BlogPostResponse> getBlogsByCategory(String category) {
        return repository.findByCategoryIgnoreCaseAndActiveTrueOrderByCreatedAtDesc(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BlogPostResponse getBlogBySlug(String slug) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new RuntimeException("Blog identifier (slug or ID) is required");
        }

        String cleanSlug = slug.trim();
        Optional<BlogPost> postOpt = repository.findBySlugAndActiveTrue(cleanSlug);

        // Fallback: If not found by slug, check if the parameter is a numeric ID
        if (postOpt.isEmpty()) {
            try {
                Long id = Long.parseLong(cleanSlug);
                postOpt = repository.findById(id).filter(b -> Boolean.TRUE.equals(b.getActive()));
            } catch (NumberFormatException ignored) {
            }
        }

        BlogPost post = postOpt.orElseThrow(() -> new RuntimeException("Blog post not found for slug or id: " + cleanSlug));
        return mapToResponse(post);
    }

    @Override
    public BlogPostResponse getBlogById(Long id) {
        BlogPost post = repository.findById(id)
                .filter(b -> Boolean.TRUE.equals(b.getActive()))
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        return mapToResponse(post);
    }

    @Override
    public BlogPostResponse getFeaturedBlog() {
        List<BlogPost> featuredList = repository.findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc();
        if (!featuredList.isEmpty()) {
            return mapToResponse(featuredList.get(0));
        }
        List<BlogPost> all = repository.findByActiveTrueOrderByCreatedAtDesc();
        if (!all.isEmpty()) {
            return mapToResponse(all.get(0));
        }
        return null;
    }

    @Override
    public List<String> getBlogCategories() {
        return repository.findDistinctCategories();
    }

    @Override
    public List<BlogPostResponse> getAllBlogsAdmin() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BlogPostResponse createBlog(BlogPostRequest request) {
        String slug = request.getSlug();
        if (slug != null) {
            slug = slug.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }
        if (slug == null || slug.isEmpty()) {
            if (request.getTitle() != null) {
                slug = request.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
            }
        }
        if (slug == null || slug.isEmpty()) {
            slug = "article-" + System.currentTimeMillis();
        }

        BlogPost post = BlogPost.builder()
                .title(request.getTitle())
                .slug(slug)
                .category(request.getCategory())
                .content(request.getContent())
                .shortDescription(request.getShortDescription())
                .imageUrl(request.getImageUrl() != null ? request.getImageUrl() : "/media/site/blog-img-1.jpg")
                .author(request.getAuthor() != null ? request.getAuthor() : "Vinnavar Team")
                .readTimeMinutes(request.getReadTimeMinutes() != null ? request.getReadTimeMinutes() : 5)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .active(request.getActive() != null ? request.getActive() : true)
                .titleTranslations(request.getTitleTranslations() != null ? new HashMap<>(request.getTitleTranslations()) : new HashMap<>())
                .shortDescriptionTranslations(request.getShortDescriptionTranslations() != null ? new HashMap<>(request.getShortDescriptionTranslations()) : new HashMap<>())
                .contentTranslations(request.getContentTranslations() != null ? new HashMap<>(request.getContentTranslations()) : new HashMap<>())
                .build();

        return mapToResponse(repository.save(post));
    }

    @Override
    @Transactional
    public BlogPostResponse updateBlog(Long id, BlogPostRequest request) {
        BlogPost post = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));

        if (request.getTitle() != null) post.setTitle(request.getTitle());
        if (request.getCategory() != null) post.setCategory(request.getCategory());
        if (request.getContent() != null) post.setContent(request.getContent());
        if (request.getShortDescription() != null) post.setShortDescription(request.getShortDescription());
        if (request.getImageUrl() != null) post.setImageUrl(request.getImageUrl());
        if (request.getAuthor() != null) post.setAuthor(request.getAuthor());
        if (request.getReadTimeMinutes() != null) post.setReadTimeMinutes(request.getReadTimeMinutes());
        if (request.getFeatured() != null) post.setFeatured(request.getFeatured());
        if (request.getActive() != null) post.setActive(request.getActive());

        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            String cleanSlug = request.getSlug().trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
            if (!cleanSlug.isEmpty()) {
                post.setSlug(cleanSlug);
            }
        }
        if (post.getSlug() == null || post.getSlug().trim().isEmpty()) {
            post.setSlug("article-" + post.getId());
        }

        if (request.getTitleTranslations() != null) {
            post.setTitleTranslations(new HashMap<>(request.getTitleTranslations()));
        }
        if (request.getShortDescriptionTranslations() != null) {
            post.setShortDescriptionTranslations(new HashMap<>(request.getShortDescriptionTranslations()));
        }
        if (request.getContentTranslations() != null) {
            post.setContentTranslations(new HashMap<>(request.getContentTranslations()));
        }

        return mapToResponse(repository.save(post));
    }

    @Override
    @Transactional
    public void deleteBlog(Long id) {
        repository.deleteById(id);
    }

    private BlogPostResponse mapToResponse(BlogPost post) {
        return BlogPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .category(post.getCategory())
                .content(post.getContent())
                .shortDescription(post.getShortDescription())
                .imageUrl(post.getImageUrl())
                .author(post.getAuthor())
                .readTimeMinutes(post.getReadTimeMinutes())
                .featured(post.getFeatured())
                .active(post.getActive())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .titleTranslations(post.getTitleTranslations() != null ? new HashMap<>(post.getTitleTranslations()) : new HashMap<>())
                .shortDescriptionTranslations(post.getShortDescriptionTranslations() != null ? new HashMap<>(post.getShortDescriptionTranslations()) : new HashMap<>())
                .contentTranslations(post.getContentTranslations() != null ? new HashMap<>(post.getContentTranslations()) : new HashMap<>())
                .build();
    }
}
