package com.vinnavar.backend.modules.product.service;

import com.vinnavar.backend.modules.product.dto.ProductRequestDto;
import com.vinnavar.backend.modules.product.entity.Category;
import com.vinnavar.backend.modules.product.entity.Product;
import com.vinnavar.backend.modules.product.entity.ProductVariant;
import com.vinnavar.backend.modules.product.repository.CategoryRepository;
import com.vinnavar.backend.modules.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public List<Category> getAllActiveCategories() {
        return categoryRepository.findAll();
    }

    public List<Product> getAllActiveProducts() {
        return productRepository.findAll();
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId);
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug).orElse(null);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Transactional
    public Product createProduct(ProductRequestDto dto) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }

        String slug = dto.getSlug() != null && !dto.getSlug().isBlank()
                ? dto.getSlug()
                : dto.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");

        Product product = Product.builder()
                .name(dto.getName())
                .slug(slug)
                .shortDescription(dto.getShortDescription())
                .fullDescription(dto.getFullDescription())
                .benefits(dto.getBenefits())
                .imageUrl(dto.getImageUrl())
                .category(category)
                .featured(dto.isFeatured())
                .active(dto.isActive())
                .variants(new ArrayList<>())
                .build();

        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            for (ProductRequestDto.VariantDto vDto : dto.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .variantName(vDto.getVariantName())
                        .price(vDto.getPrice())
                        .discountPrice(vDto.getDiscountPrice())
                        .stockQuantity(vDto.getStockQuantity() != null ? vDto.getStockQuantity() : 100)
                        .isDefault(vDto.isDefault())
                        .build();
                product.getVariants().add(variant);
            }
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            product.setCategory(category);
        }

        product.setName(dto.getName());
        if (dto.getSlug() != null && !dto.getSlug().isBlank()) {
            product.setSlug(dto.getSlug());
        }
        product.setShortDescription(dto.getShortDescription());
        product.setFullDescription(dto.getFullDescription());
        product.setBenefits(dto.getBenefits());
        if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
            product.setImageUrl(dto.getImageUrl());
        }
        product.setFeatured(dto.isFeatured());
        product.setActive(dto.isActive());

        if (dto.getVariants() != null) {
            product.getVariants().clear();
            for (ProductRequestDto.VariantDto vDto : dto.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .variantName(vDto.getVariantName())
                        .price(vDto.getPrice())
                        .discountPrice(vDto.getDiscountPrice())
                        .stockQuantity(vDto.getStockQuantity() != null ? vDto.getStockQuantity() : 100)
                        .isDefault(vDto.isDefault())
                        .build();
                product.getVariants().add(variant);
            }
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public Category createCategory(Category category) {
        if (category.getSlug() == null || category.getSlug().isBlank()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        existing.setName(category.getName());
        if (category.getSlug() != null && !category.getSlug().isBlank()) {
            existing.setSlug(category.getSlug());
        }
        existing.setDescription(category.getDescription());
        if (category.getImageUrl() != null && !category.getImageUrl().isBlank()) {
            existing.setImageUrl(category.getImageUrl());
        }
        return categoryRepository.save(existing);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedInitialOrganicCatalog() {
        // Core Categories
        List<Category> allCategories = List.of(
                Category.builder().name("Cold Pressed Oils").slug("cold-pressed-oils").description("100% Traditional Wood Pressed Oils (Marachekku Oil)").imageUrl("/media/site/category-atta-rice-dal.jpg").build(),
                Category.builder().name("Organic Rice & Grains").slug("organic-rice-grains").description("Traditional unpolished native rice varieties").imageUrl("/media/site/category-atta-rice-dal.jpg").build(),
                Category.builder().name("Natural Spices & Masala").slug("natural-spices-masala").description("Pure stone-ground spices and traditional blends").imageUrl("/media/site/category-instant-food.jpg").build(),
                Category.builder().name("Natural Sweeteners").slug("natural-sweeteners").description("Unrefined Palm Jaggery, Country Sugar & Raw Honey").imageUrl("/media/site/category-snack-munchies.jpg").build(),
                Category.builder().name("Dairy, Bread & Eggs").slug("dairy-bread-eggs").description("Fresh dairy, artisanal bread & eggs").imageUrl("/media/site/category-dairy-bread-eggs.jpg").build(),
                Category.builder().name("Fruits & Vegetables").slug("fruits-vegetables").description("Farm fresh organic fruits and vegetables").imageUrl("/media/site/fruits-vegetables.png").build(),
                Category.builder().name("Snack & Munchies").slug("snack-munchies").description("Healthy organic snacks and munchies").imageUrl("/media/site/category-snack-munchies.jpg").build(),
                Category.builder().name("Bakery & Biscuits").slug("bakery-biscuits").description("Fresh baked goods and biscuits").imageUrl("/media/site/category-bakery-biscuits.jpg").build(),
                Category.builder().name("Instant Food").slug("instant-food").description("Quick organic ready-to-cook meals").imageUrl("/media/site/category-instant-food.jpg").build(),
                Category.builder().name("Tea, Coffee & Drinks").slug("tea-coffee-drinks").description("Organic herbal tea, coffee & healthy drinks").imageUrl("/media/site/category-tea-coffee-drinks.jpg").build(),
                Category.builder().name("Cold Drinks & Juices").slug("cold-drinks-juices").description("Fresh cold pressed juices & beverages").imageUrl("/media/site/cold-drinks-juices.png").build(),
                Category.builder().name("Chicken, Meat & Fish").slug("chicken-meat-fish").description("Fresh organic poultry, meat & seafood").imageUrl("/media/site/category-chicken-meat-fish.jpg").build(),
                Category.builder().name("Baby Care").slug("baby-care").description("Gentle organic baby products").imageUrl("/media/site/category-baby-care.jpg").build(),
                Category.builder().name("Cleaning Essentials").slug("cleaning-essentials").description("Eco-friendly home cleaning products").imageUrl("/media/site/category-cleaning-essentials.jpg").build(),
                Category.builder().name("Pet Care").slug("pet-care").description("Healthy organic pet food & care").imageUrl("/media/site/category-pet-care.jpg").build(),
                Category.builder().name("Atta, Rice & Dal").slug("atta-rice-dal").description("Essential organic staples & pulses").imageUrl("/media/site/category-atta-rice-dal.jpg").build()
        );

        for (Category cat : allCategories) {
            if (categoryRepository.findBySlug(cat.getSlug()).isEmpty()) {
                categoryRepository.save(cat);
            }
        }

        Category oils = categoryRepository.findBySlug("cold-pressed-oils").orElse(allCategories.get(0));
        Category rice = categoryRepository.findBySlug("organic-rice-grains").orElse(allCategories.get(1));
        Category spices = categoryRepository.findBySlug("natural-spices-masala").orElse(allCategories.get(2));
        Category sweeteners = categoryRepository.findBySlug("natural-sweeteners").orElse(allCategories.get(3));

        if (productRepository.count() > 0) {
            return;
        }

        // Sample Product 1: Groundnut Oil
        Product groundnutOil = Product.builder()
                .name("Wood Pressed Groundnut Oil")
                .slug("wood-pressed-groundnut-oil")
                .shortDescription("Cold pressed using traditional wooden chekku. 100% pure and unrefined.")
                .fullDescription("Extracted from premium quality organic groundnuts using traditional cold pressed wood mill. Retains all natural nutrients and aroma.")
                .benefits("Contains natural antioxidants, cholesterol free, rich in Vitamin E.")
                .imageUrl("/media/products/product-img-1.jpg")
                .category(oils)
                .featured(true)
                .build();

        ProductVariant gOil500ml = ProductVariant.builder()
                .product(groundnutOil)
                .variantName("500 ml")
                .price(new BigDecimal("180.00"))
                .discountPrice(new BigDecimal("165.00"))
                .isDefault(false)
                .build();

        ProductVariant gOil1L = ProductVariant.builder()
                .product(groundnutOil)
                .variantName("1 Liter")
                .price(new BigDecimal("350.00"))
                .discountPrice(new BigDecimal("320.00"))
                .isDefault(true)
                .build();

        groundnutOil.getVariants().add(gOil500ml);
        groundnutOil.getVariants().add(gOil1L);

        // Sample Product 2: Sesame Oil
        Product sesameOil = Product.builder()
                .name("Wood Pressed Sesame / Gingelly Oil")
                .slug("wood-pressed-sesame-oil")
                .shortDescription("Traditional Marachekku Sesame Oil with pure Palm Jaggery blend.")
                .fullDescription("Extracted from black sesame seeds using wooden mill with natural palm jaggery process.")
                .benefits("Good for heart health, rich in calcium and omega fatty acids.")
                .imageUrl("/media/products/product-img-2.jpg")
                .category(oils)
                .featured(true)
                .build();

        ProductVariant sOil1L = ProductVariant.builder()
                .product(sesameOil)
                .variantName("1 Liter")
                .price(new BigDecimal("420.00"))
                .discountPrice(new BigDecimal("390.00"))
                .isDefault(true)
                .build();

        sesameOil.getVariants().add(sOil1L);

        // Sample Product 3: Seeraga Samba Rice
        Product seeragaSamba = Product.builder()
                .name("Traditional Seeraga Samba Rice")
                .slug("traditional-seeraga-samba-rice")
                .shortDescription("Aromatic raw traditional rice ideal for Biryani & Pulao.")
                .fullDescription("Naturally grown traditional small-grain rice variety known for delicious taste and distinct aroma.")
                .benefits("Easily digestible, rich in iron, low glycemic index.")
                .imageUrl("/media/products/product-img-3.jpg")
                .category(rice)
                .featured(true)
                .build();

        ProductVariant rice1kg = ProductVariant.builder()
                .product(seeragaSamba)
                .variantName("1 kg")
                .price(new BigDecimal("160.00"))
                .discountPrice(new BigDecimal("145.00"))
                .isDefault(true)
                .build();

        ProductVariant rice5kg = ProductVariant.builder()
                .product(seeragaSamba)
                .variantName("5 kg")
                .price(new BigDecimal("780.00"))
                .discountPrice(new BigDecimal("720.00"))
                .isDefault(false)
                .build();

        seeragaSamba.getVariants().add(rice1kg);
        seeragaSamba.getVariants().add(rice5kg);

        // Sample Product 4: Palm Jaggery
        Product palmJaggery = Product.builder()
                .name("Pure Karupatti (Palm Jaggery)")
                .slug("pure-karupatti-palm-jaggery")
                .shortDescription("100% natural unrefined palm sweet block.")
                .fullDescription("Traditional palm jaggery crafted naturally without any synthetic chemicals or bleaching agents.")
                .benefits("Rich in iron and minerals, natural blood purifier.")
                .imageUrl("/media/products/product-img-4.jpg")
                .category(sweeteners)
                .featured(false)
                .build();

        ProductVariant jaggery500g = ProductVariant.builder()
                .product(palmJaggery)
                .variantName("500 g")
                .price(new BigDecimal("210.00"))
                .discountPrice(new BigDecimal("195.00"))
                .isDefault(true)
                .build();

        palmJaggery.getVariants().add(jaggery500g);

        productRepository.saveAll(List.of(groundnutOil, sesameOil, seeragaSamba, palmJaggery));
    }
}
