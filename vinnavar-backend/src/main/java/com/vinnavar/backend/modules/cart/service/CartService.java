package com.vinnavar.backend.modules.cart.service;

import com.vinnavar.backend.modules.cart.dto.CartRequestDto;
import com.vinnavar.backend.modules.cart.dto.CartResponseDto;
import com.vinnavar.backend.modules.cart.entity.CartItem;
import com.vinnavar.backend.modules.cart.repository.CartItemRepository;
import com.vinnavar.backend.modules.product.entity.Product;
import com.vinnavar.backend.modules.product.entity.ProductVariant;
import com.vinnavar.backend.modules.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public CartResponseDto getCart(String cartId) {
        List<CartItem> items = cartItemRepository.findByCartId(cartId);

        BigDecimal subtotal = items.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalCount = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartResponseDto.builder()
                .cartId(cartId)
                .items(items)
                .totalItemCount(totalCount)
                .subtotal(subtotal)
                .build();
    }

    @Transactional
    public CartResponseDto addToCart(CartRequestDto request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        ProductVariant variant = product.getVariants().stream()
                .filter(v -> v.getId().equals(request.getVariantId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Variant not found"));

        int qtyToAdd = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1;

        Optional<CartItem> existingOpt = cartItemRepository
                .findByCartIdAndProductIdAndVariantId(request.getCartId(), request.getProductId(), request.getVariantId());

        if (existingOpt.isPresent()) {
            CartItem existing = existingOpt.get();
            existing.setQuantity(existing.getQuantity() + qtyToAdd);
            cartItemRepository.save(existing);
        } else {
            BigDecimal unitPrice = variant.getDiscountPrice() != null ? variant.getDiscountPrice() : variant.getPrice();
            CartItem newItem = CartItem.builder()
                    .cartId(request.getCartId())
                    .product(product)
                    .variant(variant)
                    .quantity(qtyToAdd)
                    .unitPrice(unitPrice)
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(request.getCartId());
    }

    @Transactional
    public CartResponseDto updateQuantity(Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return getCart(item.getCartId());
    }

    @Transactional
    public void removeFromCart(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearCart(String cartId) {
        cartItemRepository.deleteByCartId(cartId);
    }
}
