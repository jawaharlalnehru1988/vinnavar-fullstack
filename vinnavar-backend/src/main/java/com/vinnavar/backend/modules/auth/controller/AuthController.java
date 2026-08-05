package com.vinnavar.backend.modules.auth.controller;

import com.vinnavar.backend.modules.auth.dto.AuthDto;
import com.vinnavar.backend.modules.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/customer/register")
    public ResponseEntity<AuthDto.AuthResponse> customerRegister(@RequestBody AuthDto.CustomerRegisterRequest request) {
        return ResponseEntity.ok(authService.customerRegister(request));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<AuthDto.AuthResponse> customerLogin(@RequestBody AuthDto.CustomerLoginRequest request) {
        return ResponseEntity.ok(authService.customerLogin(request));
    }

    @PostMapping("/customer/forgot-password")
    public ResponseEntity<AuthDto.AuthResponse> forgotPassword(@RequestBody AuthDto.ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }
}
