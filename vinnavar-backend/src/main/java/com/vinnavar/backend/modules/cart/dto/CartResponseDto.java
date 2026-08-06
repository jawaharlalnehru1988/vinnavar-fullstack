package com.vinnavar.backend.modules.cart.dto;

import com.vinnavar.backend.modules.cart.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDto {
    private String cartId;
    private List<CartItem> items;
    private int totalItemCount;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal gstTax;
    private BigDecimal totalAmount;
    private double totalWeightKg;
}
