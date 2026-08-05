package com.vinnavar.backend.modules.order.controller;

import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.enums.OrderStatus;
import com.vinnavar.backend.modules.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllAdminOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        Order updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/tracking")
    public ResponseEntity<Order> updateOrderTracking(
            @PathVariable Long id,
            @RequestParam(required = false) String courierName,
            @RequestParam(required = false) String trackingNumber
    ) {
        Order updated = orderService.updateOrderTracking(id, courierName, trackingNumber);
        return ResponseEntity.ok(updated);
    }
}
