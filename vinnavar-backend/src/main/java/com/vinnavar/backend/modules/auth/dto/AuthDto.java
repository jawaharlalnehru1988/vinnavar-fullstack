package com.vinnavar.backend.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerLoginRequest {
        private String mobileNumber;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerRegisterRequest {
        private String name;
        private String mobileNumber;
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForgotPasswordRequest {
        private String mobileNumber;
        private String newPassword;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateCustomerProfileRequest {
        private String mobileNumber;
        private String name;
        private String email;
        private String currentPassword;
        private String newPassword;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String username;
        private String role;
        private String name;
        private String mobileNumber;
        private String email;
    }
}
