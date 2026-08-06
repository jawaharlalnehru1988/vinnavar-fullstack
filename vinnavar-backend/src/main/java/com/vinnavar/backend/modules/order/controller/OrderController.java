package com.vinnavar.backend.modules.order.controller;

import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import com.vinnavar.backend.modules.order.service.PdfInvoiceService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PdfInvoiceService pdfInvoiceService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByNumber(orderNumber);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderNumber}/pdf")
    public ResponseEntity<InputStreamResource> downloadInvoicePdf(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByNumber(orderNumber);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        ByteArrayInputStream bis = pdfInvoiceService.generateOrderInvoicePdf(order);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=\"Bill-" + orderNumber + ".pdf\"");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
