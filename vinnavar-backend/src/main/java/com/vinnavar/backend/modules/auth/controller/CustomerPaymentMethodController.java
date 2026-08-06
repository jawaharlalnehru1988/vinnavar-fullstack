package com.vinnavar.backend.modules.auth.controller;

import com.vinnavar.backend.modules.auth.entity.CustomerPaymentMethod;
import com.vinnavar.backend.modules.auth.service.CustomerPaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer/payment-methods")
@RequiredArgsConstructor
public class CustomerPaymentMethodController {

    private final CustomerPaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<List<CustomerPaymentMethod>> getPaymentMethodsByMobile(@RequestParam String mobile) {
        return ResponseEntity.ok(paymentMethodService.getPaymentMethodsByMobile(mobile));
    }

    @PostMapping
    public ResponseEntity<CustomerPaymentMethod> savePaymentMethod(@RequestBody CustomerPaymentMethod paymentMethod) {
        return ResponseEntity.ok(paymentMethodService.savePaymentMethod(paymentMethod));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<CustomerPaymentMethod> setDefaultPaymentMethod(@PathVariable Long id) {
        return ResponseEntity.ok(paymentMethodService.setDefaultPaymentMethod(id));
    }
}
