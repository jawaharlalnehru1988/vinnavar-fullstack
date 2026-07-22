package com.vinnavar.backend.modules.order.controller;

import com.vinnavar.backend.modules.order.dto.CheckoutRequestDto;
import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> processCheckout(@RequestBody CheckoutRequestDto request) {
        Order order = orderService.processCheckout(request);
        return ResponseEntity.ok(order);
    }
}
