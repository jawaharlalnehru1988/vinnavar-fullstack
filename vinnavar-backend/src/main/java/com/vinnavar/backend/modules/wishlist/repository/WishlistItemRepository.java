package com.vinnavar.backend.modules.wishlist.repository;

import com.vinnavar.backend.modules.wishlist.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByWishlistId(String wishlistId);

    Optional<WishlistItem> findByWishlistIdAndProductId(String wishlistId, Long productId);

    Optional<WishlistItem> findByWishlistIdAndProductIdAndVariantId(String wishlistId, Long productId, Long variantId);

    void deleteByWishlistId(String wishlistId);
    void deleteByProductId(Long productId);
}
