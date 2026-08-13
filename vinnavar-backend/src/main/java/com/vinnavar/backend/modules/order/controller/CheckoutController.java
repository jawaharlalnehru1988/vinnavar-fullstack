package com.vinnavar.backend.modules.order.controller;

import com.vinnavar.backend.modules.order.dto.CheckoutRequestDto;
import com.vinnavar.backend.modules.order.dto.RazorpayOrderResponseDto;
import com.vinnavar.backend.modules.order.dto.RazorpayVerificationRequestDto;
import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.service.OrderService;
import com.vinnavar.backend.modules.order.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final OrderService orderService;
    private final RazorpayService razorpayService;

    private void validateAddress(CheckoutRequestDto request) {
        if (request.getShippingAddress() == null || request.getShippingAddress().getStreetAddress() == null || request.getShippingAddress().getStreetAddress().trim().length() < 30) {
            throw new IllegalArgumentException("Shipping Street Address is mandatory and must be at least 30 characters long.");
        }
        if (request.getBillingAddress() != null && request.getBillingAddress().getStreetAddress() != null) {
            if (request.getBillingAddress().getStreetAddress().trim().length() < 30) {
                throw new IllegalArgumentException("Billing Street Address is mandatory and must be at least 30 characters long.");
            }
        }
    }

    @PostMapping
    public ResponseEntity<Order> processCheckout(@RequestBody CheckoutRequestDto request) {
        validateAddress(request);
        Order order = orderService.processCheckout(request);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/create-razorpay-order")
    public ResponseEntity<RazorpayOrderResponseDto> createRazorpayOrder(@RequestBody CheckoutRequestDto request) {
        validateAddress(request);
        RazorpayOrderResponseDto response = razorpayService.createRazorpayOrder(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-razorpay-payment")
    public ResponseEntity<Order> verifyRazorpayPayment(@RequestBody RazorpayVerificationRequestDto request) {
        Order order = razorpayService.verifyPayment(request);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/razorpay-key")
    public ResponseEntity<Map<String, String>> getRazorpayKey() {
        return ResponseEntity.ok(Map.of("keyId", razorpayService.getRazorpayKeyId()));
    }
}
