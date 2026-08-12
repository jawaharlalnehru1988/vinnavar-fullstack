package com.vinnavar.backend.modules.product.service;

import com.vinnavar.backend.modules.product.dto.ProductRequestDto;
import com.vinnavar.backend.modules.product.entity.Category;
import com.vinnavar.backend.modules.product.entity.Product;
import com.vinnavar.backend.modules.product.entity.ProductVariant;
import com.vinnavar.backend.modules.product.repository.CategoryRepository;
import com.vinnavar.backend.modules.product.repository.ProductRepository;
import com.vinnavar.backend.modules.cart.repository.CartItemRepository;
import com.vinnavar.backend.modules.wishlist.repository.WishlistItemRepository;
import com.vinnavar.backend.modules.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ReviewRepository reviewRepository;

    @Value("${app.media.dir:/var/www/vinnavar-fullstack/vinnavar-backend/media}")
    private String mediaDir;

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

        String hsn = (dto.getHsnCode() != null && !dto.getHsnCode().isBlank()) ? dto.getHsnCode().trim() : "1006";

        Product product = Product.builder()
                .name(dto.getName())
                .slug(slug)
                .shortDescription(dto.getShortDescription())
                .fullDescription(dto.getFullDescription())
                .benefits(dto.getBenefits())
                .hsnCode(hsn)
                .imageUrl(mainImageUrl)
                .imageUrls(images)
                .videoUrl(dto.getVideoUrl())
                .category(category)
                .featured(dto.isFeatured())
                .active(dto.isActive())
                .nameTranslations(dto.getNameTranslations() != null ? new java.util.HashMap<>(dto.getNameTranslations()) : new java.util.HashMap<>())
                .descriptionTranslations(dto.getDescriptionTranslations() != null ? new java.util.HashMap<>(dto.getDescriptionTranslations()) : new java.util.HashMap<>())
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

        Set<String> oldMedia = new HashSet<>();
        if (product.getImageUrl() != null) oldMedia.add(product.getImageUrl());
        if (product.getImageUrls() != null) oldMedia.addAll(product.getImageUrls());
        if (product.getVideoUrl() != null) oldMedia.add(product.getVideoUrl());

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
        if (dto.getHsnCode() != null && !dto.getHsnCode().isBlank()) {
            product.setHsnCode(dto.getHsnCode().trim());
        } else if (product.getHsnCode() == null || product.getHsnCode().isBlank()) {
            product.setHsnCode("1006");
        }
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
        if (dto.getNameTranslations() != null) {
            product.getNameTranslations().clear();
            product.getNameTranslations().putAll(dto.getNameTranslations());
        }
        if (dto.getDescriptionTranslations() != null) {
            product.getDescriptionTranslations().clear();
            product.getDescriptionTranslations().putAll(dto.getDescriptionTranslations());
        }
        product.setFeatured(dto.isFeatured());
        product.setActive(dto.isActive());

        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            List<ProductRequestDto.VariantDto> incomingVariants = dto.getVariants();
            List<ProductVariant> currentVariants = product.getVariants();
            if (currentVariants == null) {
                currentVariants = new ArrayList<>();
                product.setVariants(currentVariants);
            }

            for (int i = 0; i < incomingVariants.size(); i++) {
                ProductRequestDto.VariantDto vDto = incomingVariants.get(i);
                if (i < currentVariants.size()) {
                    ProductVariant existingVar = currentVariants.get(i);
                    if (vDto.getVariantName() != null) existingVar.setVariantName(vDto.getVariantName());
                    if (vDto.getPrice() != null) existingVar.setPrice(vDto.getPrice());
                    existingVar.setDiscountPrice(vDto.getDiscountPrice());
                    existingVar.setDefault(i == 0);
                } else {
                    ProductVariant newVar = ProductVariant.builder()
                            .product(product)
                            .variantName(vDto.getVariantName() != null ? vDto.getVariantName() : "Variant " + (i + 1))
                            .price(vDto.getPrice() != null ? vDto.getPrice() : BigDecimal.ZERO)
                            .discountPrice(vDto.getDiscountPrice())
                            .stockQuantity(vDto.getStockQuantity() != null ? vDto.getStockQuantity() : 100)
                            .isDefault(i == 0)
                            .build();
                    currentVariants.add(newVar);
                }
            }

            while (currentVariants.size() > incomingVariants.size()) {
                currentVariants.remove(currentVariants.size() - 1);
            }
        }

        Product saved = productRepository.save(product);

        Set<String> newMedia = new HashSet<>();
        if (saved.getImageUrl() != null) newMedia.add(saved.getImageUrl());
        if (saved.getImageUrls() != null) newMedia.addAll(saved.getImageUrls());
        if (saved.getVideoUrl() != null) newMedia.add(saved.getVideoUrl());

        oldMedia.removeAll(newMedia);
        deleteUnusedMediaFiles(oldMedia);

        return saved;
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return;
        }

        Set<String> mediaUrls = new HashSet<>();
        if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
            mediaUrls.add(product.getImageUrl());
        }
        if (product.getImageUrls() != null) {
            for (String url : product.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    mediaUrls.add(url);
                }
            }
        }
        if (product.getVideoUrl() != null && !product.getVideoUrl().isBlank()) {
            mediaUrls.add(product.getVideoUrl());
        }

        cartItemRepository.deleteByProductId(id);
        wishlistItemRepository.deleteByProductId(id);
        reviewRepository.deleteByProductId(id);

        productRepository.delete(product);
        productRepository.flush();

        deleteUnusedMediaFiles(mediaUrls);
    }

    private void deleteUnusedMediaFiles(Collection<String> mediaUrls) {
        if (mediaUrls == null || mediaUrls.isEmpty()) {
            return;
        }

        List<Product> remainingProducts = productRepository.findAll();

        for (String url : mediaUrls) {
            if (url == null || !url.startsWith("/media/")) {
                continue;
            }

            boolean isUsed = remainingProducts.stream().anyMatch(p ->
                    url.equals(p.getImageUrl()) ||
                    (p.getImageUrls() != null && p.getImageUrls().contains(url)) ||
                    url.equals(p.getVideoUrl())
            );

            if (!isUsed) {
                try {
                    String relativePath = url.substring("/media/".length());
                    Path fileToDelete = Paths.get(mediaDir, relativePath);
                    if (Files.exists(fileToDelete) && Files.isRegularFile(fileToDelete)) {
                        Files.deleteIfExists(fileToDelete);
                    }
                } catch (Exception e) {
                    System.err.println("Failed to delete media file: " + url + " - " + e.getMessage());
                }
            }
        }
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
        if (category.getNameTranslations() != null) {
            existing.getNameTranslations().clear();
            existing.getNameTranslations().putAll(category.getNameTranslations());
        }
        return categoryRepository.save(existing);
    }

    @Transactional
    public void deleteCategory(Long id) {
        List<Product> products = productRepository.findByCategoryId(id);
        for (Product p : products) {
            p.setCategory(null);
            productRepository.save(p);
        }
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
                Category.builder().name("Baby Care").slug("baby-care").description("Gentle organic baby products").imageUrl("/media/site/category-baby-care.jpg").build(),
                Category.builder().name("Cleaning Essentials").slug("cleaning-essentials").description("Eco-friendly home cleaning products").imageUrl("/media/site/category-cleaning-essentials.jpg").build(),
                Category.builder().name("Pet Care").slug("pet-care").description("Healthy organic pet food & care").imageUrl("/media/site/category-pet-care.jpg").build(),
                Category.builder().name("Atta, Rice & Dal").slug("atta-rice-dal").description("Essential organic staples & pulses").imageUrl("/media/site/category-atta-rice-dal.jpg").build()
        );

        for (Category cat : allCategories) {
            Category savedCat = categoryRepository.findBySlug(cat.getSlug()).orElseGet(() -> categoryRepository.save(cat));
            if (savedCat.getNameTranslations() == null) {
                savedCat.setNameTranslations(new java.util.HashMap<>());
            }
            if (savedCat.getDescriptionTranslations() == null) {
                savedCat.setDescriptionTranslations(new java.util.HashMap<>());
            }
            savedCat.getNameTranslations().putAll(getPreseededCategoryNameTranslations(savedCat.getSlug(), savedCat.getName()));
            savedCat.getDescriptionTranslations().putAll(getPreseededCategoryDescTranslations(savedCat.getSlug(), savedCat.getDescription()));
            categoryRepository.save(savedCat);
        }

        Category oils = categoryRepository.findBySlug("cold-pressed-oils").orElse(allCategories.get(0));
        Category rice = categoryRepository.findBySlug("organic-rice-grains").orElse(allCategories.get(1));

        if (productRepository.count() == 0) {
            upsertRiceProducts(rice);

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
                    .variantName("500g")
                    .price(new BigDecimal("180.00"))
                    .discountPrice(new BigDecimal("165.00"))
                    .isDefault(true)
                    .build();

            ProductVariant gOil2kg = ProductVariant.builder()
                    .product(groundnutOil)
                    .variantName("2kg")
                    .price(new BigDecimal("720.00"))
                    .discountPrice(new BigDecimal("660.00"))
                    .isDefault(false)
                    .build();

            ProductVariant gOil5kg = ProductVariant.builder()
                    .product(groundnutOil)
                    .variantName("5kg")
                    .price(new BigDecimal("1800.00"))
                    .discountPrice(new BigDecimal("1650.00"))
                    .isDefault(false)
                    .build();

            groundnutOil.getVariants().add(gOil500ml);
            groundnutOil.getVariants().add(gOil2kg);
            groundnutOil.getVariants().add(gOil5kg);

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

            ProductVariant sOil500g = ProductVariant.builder()
                    .product(sesameOil)
                    .variantName("500g")
                    .price(new BigDecimal("210.00"))
                    .discountPrice(new BigDecimal("195.00"))
                    .isDefault(true)
                    .build();

            ProductVariant sOil2kg = ProductVariant.builder()
                    .product(sesameOil)
                    .variantName("2kg")
                    .price(new BigDecimal("840.00"))
                    .discountPrice(new BigDecimal("680.00"))
                    .isDefault(false)
                    .build();

            ProductVariant sOil5kg = ProductVariant.builder()
                    .product(sesameOil)
                    .variantName("5kg")
                    .price(new BigDecimal("2100.00"))
                    .discountPrice(new BigDecimal("1950.00"))
                    .isDefault(false)
                    .build();

            sesameOil.getVariants().add(sOil500g);
            sesameOil.getVariants().add(sOil2kg);
            sesameOil.getVariants().add(sOil5kg);

            productRepository.saveAll(List.of(groundnutOil, sesameOil));
            standardizeAllProductVariants();
        }
    }

    @Transactional
    public void standardizeAllProductVariants() {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            List<ProductVariant> variants = product.getVariants();
            if (variants == null) {
                variants = new ArrayList<>();
                product.setVariants(variants);
            }

            BigDecimal base500gPrice = new BigDecimal("100.00");
            BigDecimal base500gDiscount = new BigDecimal("90.00");

            if (!variants.isEmpty()) {
                ProductVariant mainVar = variants.get(0);
                BigDecimal p = mainVar.getPrice() != null ? mainVar.getPrice() : new BigDecimal("100.00");
                BigDecimal dp = mainVar.getDiscountPrice() != null ? mainVar.getDiscountPrice() : p;
                String vName = mainVar.getVariantName() != null ? mainVar.getVariantName().toLowerCase() : "";

                if (vName.contains("1") && (vName.contains("kg") || vName.contains("l") || vName.contains("liter"))) {
                    base500gPrice = p.multiply(new BigDecimal("0.5")).setScale(0, java.math.RoundingMode.HALF_UP);
                    base500gDiscount = dp.multiply(new BigDecimal("0.5")).setScale(0, java.math.RoundingMode.HALF_UP);
                } else {
                    base500gPrice = p;
                    base500gDiscount = dp;
                }
            }

            BigDecimal price2kg = base500gPrice.multiply(new BigDecimal("4")).setScale(0, java.math.RoundingMode.HALF_UP);
            BigDecimal discount2kg = base500gDiscount.multiply(new BigDecimal("4")).setScale(0, java.math.RoundingMode.HALF_UP);

            BigDecimal price5kg = base500gPrice.multiply(new BigDecimal("10")).setScale(0, java.math.RoundingMode.HALF_UP);
            BigDecimal discount5kg = base500gDiscount.multiply(new BigDecimal("10")).setScale(0, java.math.RoundingMode.HALF_UP);

            String[] names = {"500g", "2kg", "5kg"};
            BigDecimal[] prices = {base500gPrice, price2kg, price5kg};
            BigDecimal[] discounts = {base500gDiscount, discount2kg, discount5kg};

            for (int i = 0; i < 3; i++) {
                if (i < variants.size()) {
                    ProductVariant existing = variants.get(i);
                    existing.setVariantName(names[i]);
                    existing.setPrice(prices[i]);
                    existing.setDiscountPrice(discounts[i]);
                    existing.setDefault(i == 0);
                } else {
                    ProductVariant newVar = ProductVariant.builder()
                            .product(product)
                            .variantName(names[i])
                            .price(prices[i])
                            .discountPrice(discounts[i])
                            .stockQuantity(100)
                            .isDefault(i == 0)
                            .build();
                    variants.add(newVar);
                }
            }

            productRepository.save(product);
        }
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
        }
        if (kavuni.getVariants().isEmpty()) {
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
        }

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
        }
        if (kolam.getVariants().isEmpty()) {
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
        }

        productRepository.save(kolam);
    }

    private java.util.Map<String, String> getPreseededCategoryNameTranslations(String slug, String fallbackName) {
        java.util.Map<String, String> m = new java.util.HashMap<>();
        if ("cold-pressed-oils".equals(slug)) {
            m.put("ta", "மரச்செக்கு எண்ணெய்கள்");
            m.put("hi", "कोल्ड-प्रेस तेल");
            m.put("te", "గానుగ నూనెలు");
            m.put("kn", "ಗಾಣದ ಎಣ್ಣೆಗಳು");
            m.put("ml", "മരച്ചക്കിൻ എണ്ണകൾ");
            m.put("mr", "कोल्ड-प्रेस तेल");
            m.put("bn", "ঘানির তেল");
            m.put("pa", "ਕੋਲਡ-ਪ੍ਰੈੱਸਡ ਤੇਲ");
        } else if ("organic-rice-grains".equals(slug)) {
            m.put("ta", "பாரம்பரிய இயற்கை அரிசி");
            m.put("hi", "पारंपरिक जैविक चावल");
            m.put("te", "సాంప్రదాయ ఆర్గానిక్ బియ్యం");
            m.put("kn", "ಸಾಂಪ್ರದಾಯಿಕ ಆರ್ಗಾನಿಕ್ ಅಕ್ಕಿ");
            m.put("ml", "പാരമ്പര്യ ജൈവ അരി");
            m.put("mr", "पारंपारिक सेंद्रिय तांदूळ");
            m.put("bn", "ঐতিহ্যবাহী অর্গানিক চাল");
            m.put("pa", "ਰਵਾਇਤੀ ਜੈਵਿਕ ਚਾਵਲ");
        } else if ("natural-spices-masala".equals(slug)) {
            m.put("ta", "இயற்கை மசாலாக்கள்");
            m.put("hi", "प्राकृतिक मसाले");
            m.put("te", "సహజ మసాలాలు");
            m.put("kn", "ನೈಸರ್ಗಿಕ ಮಸಾಲೆಗಳು");
            m.put("ml", "സ്വാഭാവിക മസാലകൾ");
            m.put("mr", "नैसर्गिक मसाले");
            m.put("bn", "প্রাকৃতিক মশলা");
            m.put("pa", "ਕੁਦਰਤੀ ਮਸਾਲੇ");
        } else if ("natural-sweeteners".equals(slug)) {
            m.put("ta", "இயற்கை இனிப்புகள்");
            m.put("hi", "प्राकृतिक मिठास");
            m.put("te", "సహజ తీపి పదార్ధాలు");
            m.put("kn", "ನೈಸರ್ಗಿಕ ಸಿಹಿ");
            m.put("ml", "സ്വാഭാവിക മധുരപലഹാരങ്ങൾ");
            m.put("mr", "नैसर्गिक गोडवा");
            m.put("bn", "প্রাকৃতিক মিষ্টি");
            m.put("pa", "ਕੁਦਰਤੀ ਮਿਠਾਸ");
        } else if ("atta-rice-dal".equals(slug)) {
            m.put("ta", "மாவு, அரிசி & பருப்பு");
            m.put("hi", "आटा, चावल और दाल");
            m.put("te", "పిండి, బియ్యం & పప్పు");
            m.put("kn", "ಹಿಟ್ಟು, ಅಕ್ಕಿ ಮತ್ತು ಬೇಳೆ");
            m.put("ml", "പൊടി, അരി & പരിപ്പ്");
            m.put("mr", "पीठ, तांदूळ आणि डाळ");
            m.put("bn", "আটা, চাল ও ডাল");
            m.put("pa", "ਆਟਾ, ਚਾਵਲ ਅਤੇ ਦਾਲ");
        } else {
            m.put("ta", fallbackName);
            m.put("hi", fallbackName);
            m.put("te", fallbackName);
            m.put("kn", fallbackName);
            m.put("ml", fallbackName);
            m.put("mr", fallbackName);
            m.put("bn", fallbackName);
            m.put("pa", fallbackName);
        }
        return m;
    }

    private java.util.Map<String, String> getPreseededCategoryDescTranslations(String slug, String fallbackDesc) {
        java.util.Map<String, String> m = new java.util.HashMap<>();
        if ("cold-pressed-oils".equals(slug)) {
            m.put("ta", "100% மரச்செக்கில் பிழியப்பட்ட தூய்மையான இயற்கை எண்ணெய்கள்");
            m.put("hi", "100% पारंपरिक लकड़ी के कोल्हू से बना शुद्ध प्राकृतिक तेल");
            m.put("te", "100% సాంప్రదాయ గానుగతో తీసిన స్వచ్ఛమైన నూనెలు");
            m.put("kn", "100% ಸಾಂಪ್ರದಾಯಿಕ ಗಾಣದಿಂದ ತೆಗೆದ ಶುದ್ಧ ಎಣ್ಣೆಗಳು");
            m.put("ml", "100% പാരമ്പര്യ മരച്ചക്കിൽ നിന്ന് നിർമ്മിച്ച വെളിച്ചെണ്ണയും എണ്ണകളും");
            m.put("mr", "100% लाकडी घाण्याचे शुद्ध सेंद्रिय तेल");
            m.put("bn", "১০০% খাঁটি কাঠের ঘানিতে তৈরি প্রাকৃতিক তেল");
            m.put("pa", "100% ਸ਼ੁੱਧ ਕੁਦਰਤੀ ਕੋਲਡ-ਪ੍ਰੈੱਸਡ ਤੇਲ");
        } else if ("organic-rice-grains".equals(slug)) {
            m.put("ta", "பாரம்பரிய பாலிஷ் செய்யப்படாத இயற்கை அரிசி வகைகள்");
            m.put("hi", "पारंपरिक अनपॉलिश देशी चावल की किस्में");
            m.put("te", "సాంప్రదాయ పాలిష్ చేయని సహజ బియ్యం రకాలు");
            m.put("kn", "ಸಾಂಪ್ರದಾಯಿಕ ಪಾಲಿಶ್ ಮಾಡದ ನೈಸರ್ಗಿಕ ಅಕ್ಕಿ ತಳಿಗಳು");
            m.put("ml", "പാരമ്പര്യമായി കൃഷി ചെയ്ത പോളിഷ് ചെയ്യാത്ത അരി ഇനങ്ങൾ");
            m.put("mr", "पारंपारिक सेंद्रिय तांदूळ प्रकार");
            m.put("bn", "ঐতিহ্যবাহী আনপলিশড অর্গানিক চালের ধরন");
            m.put("pa", "ਰਵਾਇਤੀ ਅਨਪਾਲਿਸ਼ਡ ਜੈਵਿਕ ਚਾਵਲ");
        } else {
            m.put("ta", fallbackDesc != null ? fallbackDesc : "");
            m.put("hi", fallbackDesc != null ? fallbackDesc : "");
            m.put("te", fallbackDesc != null ? fallbackDesc : "");
            m.put("kn", fallbackDesc != null ? fallbackDesc : "");
            m.put("ml", fallbackDesc != null ? fallbackDesc : "");
            m.put("mr", fallbackDesc != null ? fallbackDesc : "");
            m.put("bn", fallbackDesc != null ? fallbackDesc : "");
            m.put("pa", fallbackDesc != null ? fallbackDesc : "");
        }
        return m;
    }
}
