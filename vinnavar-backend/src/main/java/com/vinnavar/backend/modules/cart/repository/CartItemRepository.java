package com.vinnavar.backend.modules.cart.repository;

import com.vinnavar.backend.modules.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(String cartId);
    Optional<CartItem> findByCartIdAndProductIdAndVariantId(String cartId, Long productId, Long variantId);
    void deleteByCartId(String cartId);
}
