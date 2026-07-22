package com.vinnavar.backend.modules.product.controller;

import com.vinnavar.backend.modules.product.dto.ProductRequestDto;
import com.vinnavar.backend.modules.product.entity.Category;
import com.vinnavar.backend.modules.product.entity.Product;
import com.vinnavar.backend.modules.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @Value("${app.media.dir:/var/www/vinnavar-fullstack/vinnavar-backend/media}")
    private String mediaDir;

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequestDto request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequestDto request) {
        Product product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(productService.createCategory(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return ResponseEntity.ok(productService.updateCategory(id, category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        productService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/products/upload-image")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Uploaded file is empty"));
        }

        // Limit image file size to 1 MB
        if (file.getSize() > 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "Each image file size must not exceed 1 MB"));
        }

        File productsFolder = new File(mediaDir, "products");
        if (!productsFolder.exists()) {
            productsFolder.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String newFilename = "prod_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path targetPath = Paths.get(productsFolder.getAbsolutePath(), newFilename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String imageUrl = "/media/products/" + newFilename;
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    @PostMapping("/products/upload-images")
    public ResponseEntity<?> uploadProductImages(@RequestParam("files") MultipartFile[] files) throws IOException {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "No files uploaded"));
        }

        File productsFolder = new File(mediaDir, "products");
        if (!productsFolder.exists()) {
            productsFolder.mkdirs();
        }

        java.util.List<String> imageUrls = new java.util.ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty())
                continue;

            if (file.getSize() > 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File '" + file.getOriginalFilename() + "' exceeds 1 MB size limit"));
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = "prod_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path targetPath = Paths.get(productsFolder.getAbsolutePath(), newFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            imageUrls.add("/media/products/" + newFilename);
        }

        return ResponseEntity.ok(Map.of("imageUrls", imageUrls));
    }

    @PostMapping("/products/upload-video")
    public ResponseEntity<?> uploadProductVideo(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Uploaded video file is empty"));
        }

        // Limit video file size to 10 MB
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "Video file size must not exceed 10 MB"));
        }

        File videosFolder = new File(mediaDir, "videos");
        if (!videosFolder.exists()) {
            videosFolder.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String newFilename = "vid_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path targetPath = Paths.get(videosFolder.getAbsolutePath(), newFilename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String videoUrl = "/media/videos/" + newFilename;
        return ResponseEntity.ok(Map.of("videoUrl", videoUrl));
    }
}
