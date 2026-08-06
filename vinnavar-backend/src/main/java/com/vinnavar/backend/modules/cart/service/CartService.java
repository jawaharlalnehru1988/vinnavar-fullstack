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

        double totalWeightKg = items.stream()
                .mapToDouble(item -> {
                    String vName = item.getVariant() != null ? item.getVariant().getVariantName() : "";
                    return item.getQuantity() * parseWeightInKg(vName);
                })
                .sum();

        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal gstTax = BigDecimal.ZERO;
        BigDecimal totalAmount = BigDecimal.ZERO;

        if (totalCount > 0) {
            // Weight based shipping: ₹48 per 5 kg block (min ₹48)
            int blocksOf5Kg = (int) Math.ceil(totalWeightKg <= 0 ? 1 : totalWeightKg / 5.0);
            if (blocksOf5Kg < 1) blocksOf5Kg = 1;
            shippingFee = BigDecimal.valueOf(blocksOf5Kg * 48L).setScale(2, java.math.RoundingMode.HALF_UP);

            // 5% GST Tax on Subtotal
            gstTax = subtotal.multiply(new BigDecimal("0.05")).setScale(2, java.math.RoundingMode.HALF_UP);

            totalAmount = subtotal.add(shippingFee).add(gstTax).setScale(2, java.math.RoundingMode.HALF_UP);
        }

        return CartResponseDto.builder()
                .cartId(cartId)
                .items(items)
                .totalItemCount(totalCount)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .gstTax(gstTax)
                .totalAmount(totalAmount)
                .totalWeightKg(totalWeightKg)
                .build();
    }

    public static double parseWeightInKg(String variantName) {
        if (variantName == null || variantName.isBlank()) return 1.0;
        String name = variantName.trim().toLowerCase();
        try {
            if (name.contains("kg")) {
                String val = name.replaceAll("[^0-9.]", "");
                return val.isEmpty() ? 1.0 : Double.parseDouble(val);
            } else if (name.contains("gm") || name.contains("g")) {
                String val = name.replaceAll("[^0-9.]", "");
                return val.isEmpty() ? 0.5 : Double.parseDouble(val) / 1000.0;
            } else if (name.contains("liter") || name.contains("l")) {
                String val = name.replaceAll("[^0-9.]", "");
                return val.isEmpty() ? 1.0 : Double.parseDouble(val);
            } else if (name.contains("ml")) {
                String val = name.replaceAll("[^0-9.]", "");
                return val.isEmpty() ? 0.5 : Double.parseDouble(val) / 1000.0;
            }
        } catch (Exception ignored) {}
        return 1.0;
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
