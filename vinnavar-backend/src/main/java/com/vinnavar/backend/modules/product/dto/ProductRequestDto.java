package com.vinnavar.backend.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDto {
    private String name;
    private String slug;
    private String shortDescription;
    private String fullDescription;
    private String benefits;
    private String imageUrl;
    private Long categoryId;
    private boolean featured;
    private boolean active = true;
    private List<VariantDto> variants;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantDto {
        private Long id;
        private String variantName;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private Integer stockQuantity;
        private boolean isDefault;
    }
}
