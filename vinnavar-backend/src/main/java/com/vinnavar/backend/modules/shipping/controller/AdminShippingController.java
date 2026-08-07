package com.vinnavar.backend.modules.shipping.controller;

import com.vinnavar.backend.modules.shipping.entity.ShippingConfig;
import com.vinnavar.backend.modules.shipping.entity.ShippingRate;
import com.vinnavar.backend.modules.shipping.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AdminShippingController {

    private final ShippingService shippingService;

    // Public / Cart shipping calculation endpoint
    @GetMapping("/shipping/calculate")
    public ResponseEntity<ShippingService.ShippingCalculationResult> calculateShipping(
            @RequestParam(defaultValue = "0.5") double weight,
            @RequestParam(defaultValue = "Tamil Nadu") String state,
            @RequestParam(defaultValue = "RAZORPAY") String paymentMethod,
            @RequestParam(defaultValue = "0.0") BigDecimal subtotal) {

        ShippingService.ShippingCalculationResult result = shippingService.calculateShippingFee(weight, state, paymentMethod, subtotal);
        return ResponseEntity.ok(result);
    }

    // Admin Endpoints
    @GetMapping("/admin/shipping/rates")
    public ResponseEntity<List<ShippingRate>> getAllRates(@RequestParam(defaultValue = "FORWARD") String type) {
        return ResponseEntity.ok(shippingService.getAllRates(type));
    }

    @PutMapping("/admin/shipping/rates/{id}")
    public ResponseEntity<ShippingRate> updateRate(@PathVariable Long id, @RequestBody ShippingRate rate) {
        return ResponseEntity.ok(shippingService.updateRate(id, rate));
    }

    @GetMapping("/admin/shipping/configs")
    public ResponseEntity<List<ShippingConfig>> getAllConfigs() {
        return ResponseEntity.ok(shippingService.getAllConfigs());
    }

    @PutMapping("/admin/shipping/configs")
    public ResponseEntity<ShippingConfig> updateConfig(@RequestBody Map<String, String> body) {
        String key = body.get("configKey");
        String val = body.get("configValue");
        if (key == null || val == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(shippingService.updateConfig(key, val));
    }

    @PostMapping("/admin/shipping/reseed")
    public ResponseEntity<Map<String, String>> reseedFromExcel() {
        shippingService.seedFromExcel();
        return ResponseEntity.ok(Map.of("message", "Successfully reseeded shipping rates from Excel card."));
    }
}
