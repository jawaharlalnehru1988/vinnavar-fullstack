package com.vinnavar.backend.modules.wishlist.service;

import com.vinnavar.backend.modules.product.entity.Product;
import com.vinnavar.backend.modules.product.entity.ProductVariant;
import com.vinnavar.backend.modules.product.repository.ProductRepository;
import com.vinnavar.backend.modules.wishlist.dto.WishlistRequestDto;
import com.vinnavar.backend.modules.wishlist.dto.WishlistResponseDto;
import com.vinnavar.backend.modules.wishlist.entity.WishlistItem;
import com.vinnavar.backend.modules.wishlist.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public WishlistResponseDto getWishlist(String wishlistId) {
        List<WishlistItem> items = wishlistItemRepository.findByWishlistId(wishlistId);

        return WishlistResponseDto.builder()
                .wishlistId(wishlistId)
                .items(items)
                .totalItemCount(items.size())
                .build();
    }

    @Transactional
    public WishlistResponseDto addToWishlist(WishlistRequestDto request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = product.getVariants().stream()
                    .filter(v -> v.getId().equals(request.getVariantId()))
                    .findFirst()
                    .orElse(null);
        }

        if (variant == null && !product.getVariants().isEmpty()) {
            variant = product.getVariants().get(0);
        }

        Optional<WishlistItem> existingOpt = request.getVariantId() != null
                ? wishlistItemRepository.findByWishlistIdAndProductIdAndVariantId(request.getWishlistId(), request.getProductId(), request.getVariantId())
                : wishlistItemRepository.findByWishlistIdAndProductId(request.getWishlistId(), request.getProductId());

        if (existingOpt.isEmpty()) {
            WishlistItem newItem = WishlistItem.builder()
                    .wishlistId(request.getWishlistId())
                    .product(product)
                    .variant(variant)
                    .build();
            wishlistItemRepository.save(newItem);
        }

        return getWishlist(request.getWishlistId());
    }

    @Transactional
    public WishlistResponseDto toggleWishlist(WishlistRequestDto request) {
        Optional<WishlistItem> existingOpt = request.getVariantId() != null
                ? wishlistItemRepository.findByWishlistIdAndProductIdAndVariantId(request.getWishlistId(), request.getProductId(), request.getVariantId())
                : wishlistItemRepository.findByWishlistIdAndProductId(request.getWishlistId(), request.getProductId());

        if (existingOpt.isPresent()) {
            wishlistItemRepository.delete(existingOpt.get());
        } else {
            addToWishlist(request);
        }

        return getWishlist(request.getWishlistId());
    }

    @Transactional
    public void removeFromWishlist(Long itemId) {
        wishlistItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearWishlist(String wishlistId) {
        wishlistItemRepository.deleteByWishlistId(wishlistId);
    }
}
