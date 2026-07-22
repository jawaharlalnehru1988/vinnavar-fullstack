package com.vinnavar.backend.modules.auth.service;

import com.vinnavar.backend.modules.auth.dto.AuthDto;
import com.vinnavar.backend.modules.auth.entity.AdminUser;
import com.vinnavar.backend.modules.auth.repository.AdminUserRepository;
import com.vinnavar.backend.modules.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final JwtUtil jwtUtil;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedDefaultAdmin() {
        if (adminUserRepository.findByUsername("vinnavar").isEmpty()) {
            AdminUser admin = AdminUser.builder()
                    .username("vinnavar")
                    .password("7550210447")
                    .role("ADMIN")
                    .build();
            adminUserRepository.save(admin);
        }
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        AdminUser admin = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!admin.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(admin.getUsername(), admin.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .username(admin.getUsername())
                .role(admin.getRole())
                .build();
    }
}
