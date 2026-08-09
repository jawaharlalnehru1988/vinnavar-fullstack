package com.vinnavar.backend.modules.wishlist.controller;

import com.vinnavar.backend.modules.wishlist.dto.WishlistRequestDto;
import com.vinnavar.backend.modules.wishlist.dto.WishlistResponseDto;
import com.vinnavar.backend.modules.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{wishlistId}")
    public ResponseEntity<WishlistResponseDto> getWishlist(@PathVariable String wishlistId) {
        return ResponseEntity.ok(wishlistService.getWishlist(wishlistId));
    }

    @PostMapping("/items")
    public ResponseEntity<WishlistResponseDto> addToWishlist(@RequestBody WishlistRequestDto request) {
        return ResponseEntity.ok(wishlistService.addToWishlist(request));
    }

    @PostMapping("/toggle")
    public ResponseEntity<WishlistResponseDto> toggleWishlist(@RequestBody WishlistRequestDto request) {
        return ResponseEntity.ok(wishlistService.toggleWishlist(request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long itemId) {
        wishlistService.removeFromWishlist(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<Void> clearWishlist(@PathVariable String wishlistId) {
        wishlistService.clearWishlist(wishlistId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<WishlistResponseDto> mergeWishlists(
            @RequestParam String guestWishlistId,
            @RequestParam String userWishlistId) {
        return ResponseEntity.ok(wishlistService.mergeWishlists(guestWishlistId, userWishlistId));
    }
}

