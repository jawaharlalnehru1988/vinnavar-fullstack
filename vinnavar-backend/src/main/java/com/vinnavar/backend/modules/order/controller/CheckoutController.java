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

    @PostMapping
    public ResponseEntity<Order> processCheckout(@RequestBody CheckoutRequestDto request) {
        Order order = orderService.processCheckout(request);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/create-razorpay-order")
    public ResponseEntity<RazorpayOrderResponseDto> createRazorpayOrder(@RequestBody CheckoutRequestDto request) {
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
