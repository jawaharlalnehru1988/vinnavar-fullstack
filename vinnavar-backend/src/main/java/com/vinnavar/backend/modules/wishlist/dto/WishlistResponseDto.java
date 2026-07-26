package com.vinnavar.backend.modules.wishlist.dto;

import com.vinnavar.backend.modules.wishlist.entity.WishlistItem;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponseDto {
    private String wishlistId;
    private List<WishlistItem> items;
    private int totalItemCount;
}
