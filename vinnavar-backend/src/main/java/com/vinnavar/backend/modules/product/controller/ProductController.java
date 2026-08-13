package com.vinnavar.backend.modules.product.controller;

import com.vinnavar.backend.modules.product.entity.Category;
import com.vinnavar.backend.modules.product.entity.Product;
import com.vinnavar.backend.modules.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(productService.getAllActiveCategories());
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false, defaultValue = "false") boolean featured
    ) {
        if (featured) {
            return ResponseEntity.ok(productService.getFeaturedProducts());
        }
        if (categoryId != null) {
            return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
        }
        return ResponseEntity.ok(productService.getAllActiveProducts());
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<Product> getProductBySlug(@PathVariable String slug) {
        Product product = productService.getProductBySlug(slug);
        if (product == null && slug.matches("\\d+")) {
            product = productService.getProductById(Long.parseLong(slug));
        }
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    /**
     * Open Graph share endpoint — used by Nginx to serve OG meta tags to
     * social media crawlers (WhatsApp, Facebook, Telegram, etc.) so that
     * link previews display the product image and title correctly.
     *
     * Regular users are immediately redirected to the React SPA via JS.
     */
    @GetMapping(value = "/products/{slug}/share", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getProductSharePage(
            @PathVariable String slug,
            @RequestHeader(value = "X-Forwarded-Proto", required = false) String proto,
            @RequestHeader(value = "Host", required = false) String host
    ) {
        Product product = productService.getProductBySlug(slug);
        if (product == null && slug.matches("\\d+")) {
            product = productService.getProductById(Long.parseLong(slug));
        }
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        String scheme = (proto != null && proto.equals("https")) ? "https" : "https";
        String hostName = (host != null) ? host : "vinnavar.com";
        String pageUrl  = scheme + "://" + hostName + "/product/" + product.getSlug();

        // Pick first image — prefer imageUrls list, fall back to imageUrl field
        String rawImage = (product.getImageUrls() != null && !product.getImageUrls().isEmpty())
                ? product.getImageUrls().get(0)
                : product.getImageUrl();

        // Build absolute image URL
        String imageUrl;
        if (rawImage != null && (rawImage.startsWith("http://") || rawImage.startsWith("https://"))) {
            imageUrl = rawImage;
        } else if (rawImage != null) {
            imageUrl = scheme + "://" + hostName + rawImage;
        } else {
            imageUrl = scheme + "://" + hostName + "/media/site/logo_vinnavar.webp";
        }

        String productName = product.getName() != null ? escapeHtml(product.getName()) : "Vinnavar Organic Product";
        String description  = product.getShortDescription() != null
                ? escapeHtml(product.getShortDescription())
                : "Buy " + productName + " from Vinnavar Organics — 100% pure & authentic organic products.";

        String html = "<!DOCTYPE html>\n"
                + "<html lang=\"en\">\n"
                + "<head>\n"
                + "  <meta charset=\"UTF-8\">\n"
                + "  <title>" + productName + " | Vinnavar Organics</title>\n"

                // --- Open Graph tags ---
                + "  <meta property=\"og:type\"        content=\"product\" />\n"
                + "  <meta property=\"og:url\"         content=\"" + pageUrl + "\" />\n"
                + "  <meta property=\"og:title\"       content=\"" + productName + " | Vinnavar Organics\" />\n"
                + "  <meta property=\"og:description\" content=\"" + description + "\" />\n"
                + "  <meta property=\"og:image\"       content=\"" + imageUrl + "\" />\n"
                + "  <meta property=\"og:image:width\" content=\"1200\" />\n"
                + "  <meta property=\"og:image:height\" content=\"630\" />\n"
                + "  <meta property=\"og:site_name\"   content=\"Vinnavar Organics\" />\n"

                // --- Twitter Card tags ---
                + "  <meta name=\"twitter:card\"        content=\"summary_large_image\" />\n"
                + "  <meta name=\"twitter:title\"       content=\"" + productName + " | Vinnavar Organics\" />\n"
                + "  <meta name=\"twitter:description\" content=\"" + description + "\" />\n"
                + "  <meta name=\"twitter:image\"       content=\"" + imageUrl + "\" />\n"

                // Redirect real browsers back to the React page
                + "  <meta http-equiv=\"refresh\" content=\"0; url=" + pageUrl + "\" />\n"
                + "</head>\n"
                + "<body>\n"
                + "  <script>window.location.href = \"" + pageUrl + "\";</script>\n"
                + "  <p>Redirecting to <a href=\"" + pageUrl + "\">" + productName + "</a>…</p>\n"
                + "</body>\n"
                + "</html>";

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}

