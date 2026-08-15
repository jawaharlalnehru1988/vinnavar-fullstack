package com.vinnavar.backend.modules.product.service;

import com.vinnavar.backend.modules.product.dto.ProductRequestDto;
import com.vinnavar.backend.modules.product.entity.Category;
import com.vinnavar.backend.modules.product.entity.Product;
import com.vinnavar.backend.modules.product.entity.ProductVariant;
import com.vinnavar.backend.modules.product.repository.CategoryRepository;
import com.vinnavar.backend.modules.product.repository.ProductRepository;
import com.vinnavar.backend.modules.cart.repository.CartItemRepository;
import com.vinnavar.backend.modules.wishlist.repository.WishlistItemRepository;
import com.vinnavar.backend.modules.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ReviewRepository reviewRepository;

    @Value("${app.media.dir:/var/www/vinnavar-fullstack/vinnavar-backend/media}")
    private String mediaDir;

    public List<Category> getAllActiveCategories() {
        return categoryRepository.findAll();
    }

    public List<Product> getAllActiveProducts() {
        return productRepository.findAll();
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId);
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug).orElse(null);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Transactional
    public Product createProduct(ProductRequestDto dto) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }

        String slug = dto.getSlug() != null && !dto.getSlug().isBlank()
                ? dto.getSlug()
                : dto.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");

        List<String> images = dto.getImageUrls() != null ? new ArrayList<>(dto.getImageUrls()) : new ArrayList<>();
        String mainImageUrl = dto.getImageUrl();
        if ((mainImageUrl == null || mainImageUrl.isBlank()) && !images.isEmpty()) {
            mainImageUrl = images.get(0);
        }

        String hsn = (dto.getHsnCode() != null && !dto.getHsnCode().isBlank()) ? dto.getHsnCode().trim() : "1006";

        Product product = Product.builder()
                .name(dto.getName())
                .slug(slug)
                .shortDescription(dto.getShortDescription())
                .fullDescription(dto.getFullDescription())
                .benefits(dto.getBenefits())
                .hsnCode(hsn)
                .imageUrl(mainImageUrl)
                .imageUrls(images)
                .videoUrl(dto.getVideoUrl())
                .category(category)
                .featured(dto.isFeatured())
                .active(dto.isActive())
                .nameTranslations(dto.getNameTranslations() != null ? new java.util.HashMap<>(dto.getNameTranslations()) : new java.util.HashMap<>())
                .descriptionTranslations(dto.getDescriptionTranslations() != null ? new java.util.HashMap<>(dto.getDescriptionTranslations()) : new java.util.HashMap<>())
                .variants(new ArrayList<>())
                .build();

        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            for (ProductRequestDto.VariantDto vDto : dto.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .variantName(vDto.getVariantName())
                        .price(vDto.getPrice())
                        .discountPrice(vDto.getDiscountPrice())
                        .stockQuantity(vDto.getStockQuantity() != null ? vDto.getStockQuantity() : 100)
                        .isDefault(vDto.isDefault())
                        .build();
                product.getVariants().add(variant);
            }
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Set<String> oldMedia = new HashSet<>();
        if (product.getImageUrl() != null) oldMedia.add(product.getImageUrl());
        if (product.getImageUrls() != null) oldMedia.addAll(product.getImageUrls());
        if (product.getVideoUrl() != null) oldMedia.add(product.getVideoUrl());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            product.setCategory(category);
        }

        product.setName(dto.getName());
        if (dto.getSlug() != null && !dto.getSlug().isBlank()) {
            product.setSlug(dto.getSlug());
        }
        product.setShortDescription(dto.getShortDescription());
        product.setFullDescription(dto.getFullDescription());
        product.setBenefits(dto.getBenefits());
        if (dto.getHsnCode() != null && !dto.getHsnCode().isBlank()) {
            product.setHsnCode(dto.getHsnCode().trim());
        } else if (product.getHsnCode() == null || product.getHsnCode().isBlank()) {
            product.setHsnCode("1006");
        }
        if (dto.getImageUrls() != null) {
            product.getImageUrls().clear();
            product.getImageUrls().addAll(dto.getImageUrls());
        }
        product.setVideoUrl(dto.getVideoUrl());
        String mainImageUrl = dto.getImageUrl();
        if ((mainImageUrl == null || mainImageUrl.isBlank()) && product.getImageUrls() != null && !product.getImageUrls().isEmpty()) {
            mainImageUrl = product.getImageUrls().get(0);
        }
        if (mainImageUrl != null && !mainImageUrl.isBlank()) {
            product.setImageUrl(mainImageUrl);
        }
        if (dto.getNameTranslations() != null) {
            product.getNameTranslations().clear();
            product.getNameTranslations().putAll(dto.getNameTranslations());
        }
        if (dto.getDescriptionTranslations() != null) {
            product.getDescriptionTranslations().clear();
            product.getDescriptionTranslations().putAll(dto.getDescriptionTranslations());
        }
        product.setFeatured(dto.isFeatured());
        product.setActive(dto.isActive());

        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            List<ProductRequestDto.VariantDto> incomingVariants = dto.getVariants();
            List<ProductVariant> currentVariants = product.getVariants();
            if (currentVariants == null) {
                currentVariants = new ArrayList<>();
                product.setVariants(currentVariants);
            }

            for (int i = 0; i < incomingVariants.size(); i++) {
                ProductRequestDto.VariantDto vDto = incomingVariants.get(i);
                if (i < currentVariants.size()) {
                    ProductVariant existingVar = currentVariants.get(i);
                    if (vDto.getVariantName() != null) existingVar.setVariantName(vDto.getVariantName());
                    if (vDto.getPrice() != null) existingVar.setPrice(vDto.getPrice());
                    existingVar.setDiscountPrice(vDto.getDiscountPrice());
                    existingVar.setDefault(i == 0);
                } else {
                    ProductVariant newVar = ProductVariant.builder()
                            .product(product)
                            .variantName(vDto.getVariantName() != null ? vDto.getVariantName() : "Variant " + (i + 1))
                            .price(vDto.getPrice() != null ? vDto.getPrice() : BigDecimal.ZERO)
                            .discountPrice(vDto.getDiscountPrice())
                            .stockQuantity(vDto.getStockQuantity() != null ? vDto.getStockQuantity() : 100)
                            .isDefault(i == 0)
                            .build();
                    currentVariants.add(newVar);
                }
            }

            while (currentVariants.size() > incomingVariants.size()) {
                currentVariants.remove(currentVariants.size() - 1);
            }
        }

        Product saved = productRepository.save(product);

        Set<String> newMedia = new HashSet<>();
        if (saved.getImageUrl() != null) newMedia.add(saved.getImageUrl());
        if (saved.getImageUrls() != null) newMedia.addAll(saved.getImageUrls());
        if (saved.getVideoUrl() != null) newMedia.add(saved.getVideoUrl());

        oldMedia.removeAll(newMedia);
        deleteUnusedMediaFiles(oldMedia);

        return saved;
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return;
        }

        Set<String> mediaUrls = new HashSet<>();
        if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
            mediaUrls.add(product.getImageUrl());
        }
        if (product.getImageUrls() != null) {
            for (String url : product.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    mediaUrls.add(url);
                }
            }
        }
        if (product.getVideoUrl() != null && !product.getVideoUrl().isBlank()) {
            mediaUrls.add(product.getVideoUrl());
        }

        cartItemRepository.deleteByProductId(id);
        wishlistItemRepository.deleteByProductId(id);
        reviewRepository.deleteByProductId(id);

        productRepository.delete(product);
        productRepository.flush();

        deleteUnusedMediaFiles(mediaUrls);
    }

    private void deleteUnusedMediaFiles(Collection<String> mediaUrls) {
        if (mediaUrls == null || mediaUrls.isEmpty()) {
            return;
        }

        List<Product> remainingProducts = productRepository.findAll();

        for (String url : mediaUrls) {
            if (url == null || !url.startsWith("/media/")) {
                continue;
            }

            boolean isUsed = remainingProducts.stream().anyMatch(p ->
                    url.equals(p.getImageUrl()) ||
                    (p.getImageUrls() != null && p.getImageUrls().contains(url)) ||
                    url.equals(p.getVideoUrl())
            );

            if (!isUsed) {
                try {
                    String relativePath = url.substring("/media/".length());
                    Path fileToDelete = Paths.get(mediaDir, relativePath);
                    if (Files.exists(fileToDelete) && Files.isRegularFile(fileToDelete)) {
                        Files.deleteIfExists(fileToDelete);
                    }
                } catch (Exception e) {
                    System.err.println("Failed to delete media file: " + url + " - " + e.getMessage());
                }
            }
        }
    }

    @Transactional
    public Category createCategory(Category category) {
        if (category.getSlug() == null || category.getSlug().isBlank()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        existing.setName(category.getName());
        if (category.getSlug() != null && !category.getSlug().isBlank()) {
            existing.setSlug(category.getSlug());
        }
        existing.setDescription(category.getDescription());
        if (category.getImageUrl() != null && !category.getImageUrl().isBlank()) {
            existing.setImageUrl(category.getImageUrl());
        }
        if (category.getNameTranslations() != null) {
            existing.getNameTranslations().clear();
            existing.getNameTranslations().putAll(category.getNameTranslations());
        }
        return categoryRepository.save(existing);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) return;
        
        List<Product> products = productRepository.findByCategoryId(id);
        for (Product p : products) {
            p.setCategory(null);
            productRepository.save(p);
        }
        
        String imageUrl = category.getImageUrl();
        categoryRepository.deleteById(id);
        
        if (imageUrl != null && !imageUrl.isEmpty()) {
            deleteUnusedMediaFiles(java.util.Collections.singletonList(imageUrl));
        }
    }

}
