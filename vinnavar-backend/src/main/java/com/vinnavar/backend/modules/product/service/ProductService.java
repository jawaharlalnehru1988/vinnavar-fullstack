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

        List<String> images = dto.getImageUrls() != null ? new ArrayList<>(dto.getImageUrls()) : new ArrayList<>();
        String mainImageUrl = dto.getImageUrl();
        if ((mainImageUrl == null || mainImageUrl.isBlank()) && !images.isEmpty()) {
            mainImageUrl = images.get(0);
        }

        Product product = Product.builder()
                .name(dto.getName())
                .slug(slug)
                .shortDescription(dto.getShortDescription())
                .fullDescription(dto.getFullDescription())
                .benefits(dto.getBenefits())
                .imageUrl(mainImageUrl)
                .imageUrls(images)
                .videoUrl(dto.getVideoUrl())
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
        if (dto.getImageUrls() != null) {
            product.getImageUrls().clear();
            product.getImageUrls().addAll(dto.getImageUrls());
        }
        product.setVideoUrl(dto.getVideoUrl());
        String mainImageUrl = dto.getImageUrl();
        if ((mainImageUrl == null || mainImageUrl.isBlank()) && product.getImageUrls() != null && !product.getImageUrls().isEmpty()) {
            mainImageUrl = product.getImageUrls().get(0);
        }
        if (mainImageUrl != null && !mainImageUrl.isBlank()) {
            product.setImageUrl(mainImageUrl);
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

        upsertRiceProducts(rice);

        if (productRepository.count() > 2) {
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

        productRepository.saveAll(List.of(groundnutOil, sesameOil));
    }

    @Transactional
    public void upsertRiceProducts(Category riceCategory) {
        // 1. Karuppu Kavuni Rice
        Product kavuni = productRepository.findBySlug("karuppu-kavuni-rice")
                .orElseGet(() -> Product.builder().slug("karuppu-kavuni-rice").build());

        kavuni.setName("Karuppu Kavuni Rice");
        kavuni.setShortDescription("100% Pure Natural & Raw Gluten Free Karuppu Kavuni Black Rice (Emperor Rice). (Inclusive of shipping charge + all taxes)");
        kavuni.setFullDescription("Extracted from premium quality organic Karuppu Kavuni black rice. Rich in antioxidants, iron, protein, and dietary fiber. Known as the royal rice of Chola Kings.");
        kavuni.setBenefits("Rich in Antioxidants, High in Fiber, Gluten-Free, Supports Weight Management, Good source of Protein & Iron.");
        kavuni.setImageUrl("/media/vinnavarwebsitecreation/1.webp");
        kavuni.setImageUrls(new ArrayList<>(List.of(
                "/media/vinnavarwebsitecreation/1.webp",
                "/media/vinnavarwebsitecreation/2.webp",
                "/media/vinnavarwebsitecreation/3.webp",
                "/media/vinnavarwebsitecreation/4.webp",
                "/media/vinnavarwebsitecreation/5.webp",
                "/media/vinnavarwebsitecreation/6.webp",
                "/media/vinnavarwebsitecreation/7.webp",
                "/media/vinnavarwebsitecreation/8.webp",
                "/media/vinnavarwebsitecreation/9.webp",
                "/media/vinnavarwebsitecreation/10.webp"
        )));
        kavuni.setCategory(riceCategory);
        kavuni.setFeatured(true);
        kavuni.setActive(true);

        if (kavuni.getVariants() == null) {
            kavuni.setVariants(new ArrayList<>());
        } else {
            kavuni.getVariants().clear();
        }

        kavuni.getVariants().add(ProductVariant.builder()
                .product(kavuni)
                .variantName("500G")
                .price(new BigDecimal("149.00"))
                .discountPrice(new BigDecimal("149.00"))
                .stockQuantity(100)
                .isDefault(false)
                .build());
        kavuni.getVariants().add(ProductVariant.builder()
                .product(kavuni)
                .variantName("5KG")
                .price(new BigDecimal("949.00"))
                .discountPrice(new BigDecimal("949.00"))
                .stockQuantity(100)
                .isDefault(true)
                .build());
        kavuni.getVariants().add(ProductVariant.builder()
                .product(kavuni)
                .variantName("25KG")
                .price(new BigDecimal("3999.00"))
                .discountPrice(new BigDecimal("3999.00"))
                .stockQuantity(100)
                .isDefault(false)
                .build());

        productRepository.save(kavuni);

        // 2. Kolam Rice
        Product kolam = productRepository.findBySlug("kolam-rice")
                .orElseGet(() -> Product.builder().slug("kolam-rice").build());

        kolam.setName("Kolam Rice");
        kolam.setShortDescription("100% Pure Natural & Raw Gluten Free HMT Kolam Raw Rice. (Inclusive of shipping charge + all taxes)");
        kolam.setFullDescription("Premium HMT Kolam Raw Rice known for easy digestibility, soft texture, and delicate natural aroma.");
        kolam.setBenefits("Easily digestible, rich in carbohydrates, gluten-free, 100% natural and unpolished.");
        kolam.setImageUrl("/media/vinnavarwebsitecreation/1_1.webp");
        kolam.setImageUrls(new ArrayList<>(List.of(
                "/media/vinnavarwebsitecreation/1_1.webp",
                "/media/vinnavarwebsitecreation/2_1.webp",
                "/media/vinnavarwebsitecreation/3_1.webp",
                "/media/vinnavarwebsitecreation/4_1.webp",
                "/media/vinnavarwebsitecreation/5_1.webp",
                "/media/vinnavarwebsitecreation/6_1.webp",
                "/media/vinnavarwebsitecreation/7_1.webp",
                "/media/vinnavarwebsitecreation/8_1.webp",
                "/media/vinnavarwebsitecreation/9_1.webp",
                "/media/vinnavarwebsitecreation/10_1.webp",
                "/media/vinnavarwebsitecreation/11.webp"
        )));
        kolam.setCategory(riceCategory);
        kolam.setFeatured(true);
        kolam.setActive(true);

        if (kolam.getVariants() == null) {
            kolam.setVariants(new ArrayList<>());
        } else {
            kolam.getVariants().clear();
        }

        kolam.getVariants().add(ProductVariant.builder()
                .product(kolam)
                .variantName("500G")
                .price(new BigDecimal("149.00"))
                .discountPrice(new BigDecimal("149.00"))
                .stockQuantity(100)
                .isDefault(false)
                .build());
        kolam.getVariants().add(ProductVariant.builder()
                .product(kolam)
                .variantName("5KG")
                .price(new BigDecimal("749.00"))
                .discountPrice(new BigDecimal("749.00"))
                .stockQuantity(100)
                .isDefault(true)
                .build());
        kolam.getVariants().add(ProductVariant.builder()
                .product(kolam)
                .variantName("25KG")
                .price(new BigDecimal("2999.00"))
                .discountPrice(new BigDecimal("2999.00"))
                .stockQuantity(100)
                .isDefault(false)
                .build());

        productRepository.save(kolam);
    }
}
