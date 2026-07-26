package com.vinnavar.backend.modules.wishlist.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistRequestDto {
    private String wishlistId;
    private Long productId;
    private Long variantId;
}
