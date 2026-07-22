package com.vinnavar.backend.modules.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartRequestDto {
    private String cartId;
    private Long productId;
    private Long variantId;
    private Integer quantity;
}
