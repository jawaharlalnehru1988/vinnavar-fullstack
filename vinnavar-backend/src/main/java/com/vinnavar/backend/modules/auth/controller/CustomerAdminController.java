package com.vinnavar.backend.modules.auth.controller;

import com.vinnavar.backend.modules.auth.dto.AuthDto;
import com.vinnavar.backend.modules.auth.entity.CustomerUser;
import com.vinnavar.backend.modules.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
public class CustomerAdminController {

    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<CustomerUser>> getAllCustomers() {
        return ResponseEntity.ok(authService.getAllCustomers());
    }

    @PostMapping
    public ResponseEntity<AuthDto.AuthResponse> createCustomer(@RequestBody AuthDto.CustomerRegisterRequest request) {
        return ResponseEntity.ok(authService.customerRegister(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerUser> updateCustomer(@PathVariable Long id, @RequestBody AuthDto.CustomerRegisterRequest request) {
        return ResponseEntity.ok(authService.updateCustomerByAdmin(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        authService.deleteCustomerByAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
