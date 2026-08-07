package com.vinnavar.backend.modules.cart.controller;

import com.vinnavar.backend.modules.cart.dto.CartRequestDto;
import com.vinnavar.backend.modules.cart.dto.CartResponseDto;
import com.vinnavar.backend.modules.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{cartId}")
    public ResponseEntity<CartResponseDto> getCart(
            @PathVariable String cartId,
            @RequestParam(required = false, defaultValue = "Tamil Nadu") String state,
            @RequestParam(required = false, defaultValue = "RAZORPAY") String paymentMethod) {
        return ResponseEntity.ok(cartService.getCart(cartId, state, paymentMethod));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponseDto> addToCart(@RequestBody CartRequestDto request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDto> updateQuantity(
            @PathVariable Long itemId,
            @RequestParam int quantity
    ) {
        return ResponseEntity.ok(cartService.updateQuantity(itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId) {
        cartService.removeFromCart(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> clearCart(@PathVariable String cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }
}
