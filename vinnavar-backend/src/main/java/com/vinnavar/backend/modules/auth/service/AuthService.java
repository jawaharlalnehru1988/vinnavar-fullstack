package com.vinnavar.backend.modules.auth.service;

import com.vinnavar.backend.modules.auth.dto.AuthDto;
import com.vinnavar.backend.modules.auth.entity.AdminUser;
import com.vinnavar.backend.modules.auth.entity.CustomerUser;
import com.vinnavar.backend.modules.auth.repository.AdminUserRepository;
import com.vinnavar.backend.modules.auth.repository.CustomerUserRepository;
import com.vinnavar.backend.modules.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final CustomerUserRepository customerUserRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.google.clientId:}")
    private String googleClientId;

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

    @Transactional
    public AuthDto.AuthResponse customerRegister(AuthDto.CustomerRegisterRequest request) {
        if (request.getMobileNumber() == null || request.getMobileNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Mobile phone number is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        String cleanMobile = request.getMobileNumber().replaceAll("[^0-9]", "");
        if (cleanMobile.length() > 10) {
            cleanMobile = cleanMobile.substring(cleanMobile.length() - 10);
        }

        if (customerUserRepository.existsByMobileNumber(cleanMobile)) {
            throw new IllegalArgumentException("An account with this mobile number already exists. Please Sign In.");
        }

        CustomerUser customer = CustomerUser.builder()
                .name(request.getName() != null && !request.getName().trim().isEmpty() ? request.getName() : "Valued Customer")
                .mobileNumber(cleanMobile)
                .email(request.getEmail())
                .password(request.getPassword())
                .role("CUSTOMER")
                .build();

        customerUserRepository.save(customer);

        String token = jwtUtil.generateToken(customer.getMobileNumber(), customer.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .id(customer.getId())
                .username(customer.getMobileNumber())
                .name(customer.getName())
                .mobileNumber(customer.getMobileNumber())
                .email(customer.getEmail())
                .role(customer.getRole())
                .build();
    }

    public AuthDto.AuthResponse customerLogin(AuthDto.CustomerLoginRequest request) {
        if (request.getMobileNumber() == null || request.getMobileNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Please enter your registered Mobile Phone Number");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Please enter your Password");
        }

        String cleanMobile = request.getMobileNumber().replaceAll("[^0-9]", "");
        if (cleanMobile.length() > 10) {
            cleanMobile = cleanMobile.substring(cleanMobile.length() - 10);
        }

        CustomerUser customer = customerUserRepository.findByMobileNumber(cleanMobile)
                .orElseThrow(() -> new IllegalArgumentException("No account found with mobile number " + request.getMobileNumber() + ". Please Sign Up."));

        if (!customer.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid password. Please try again or click 'Forgot Password?'.");
        }

        String token = jwtUtil.generateToken(customer.getMobileNumber(), customer.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .id(customer.getId())
                .username(customer.getMobileNumber())
                .name(customer.getName())
                .mobileNumber(customer.getMobileNumber())
                .email(customer.getEmail())
                .role(customer.getRole())
                .build();
    }

    @Transactional
    public AuthDto.AuthResponse forgotPassword(AuthDto.ForgotPasswordRequest request) {
        if (request.getMobileNumber() == null || request.getMobileNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Please enter your registered Mobile Phone Number");
        }
        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Please enter your new Password");
        }

        String cleanMobile = request.getMobileNumber().replaceAll("[^0-9]", "");
        if (cleanMobile.length() > 10) {
            cleanMobile = cleanMobile.substring(cleanMobile.length() - 10);
        }

        CustomerUser customer = customerUserRepository.findByMobileNumber(cleanMobile)
                .orElseThrow(() -> new IllegalArgumentException("No registered user found with mobile number " + request.getMobileNumber()));

        customer.setPassword(request.getNewPassword());
        customerUserRepository.save(customer);

        String token = jwtUtil.generateToken(customer.getMobileNumber(), customer.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .id(customer.getId())
                .username(customer.getMobileNumber())
                .name(customer.getName())
                .mobileNumber(customer.getMobileNumber())
                .email(customer.getEmail())
                .role(customer.getRole())
                .build();
    }

    public java.util.List<CustomerUser> getAllCustomers() {
        return customerUserRepository.findAll();
    }

    @Transactional
    public CustomerUser updateCustomerByAdmin(Long id, AuthDto.CustomerRegisterRequest request) {
        CustomerUser customer = customerUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            customer.setName(request.getName().trim());
        }
        if (request.getMobileNumber() != null && !request.getMobileNumber().trim().isEmpty()) {
            String cleanMobile = request.getMobileNumber().replaceAll("[^0-9]", "");
            if (cleanMobile.length() > 10) {
                cleanMobile = cleanMobile.substring(cleanMobile.length() - 10);
            }
            if (!cleanMobile.equals(customer.getMobileNumber()) && customerUserRepository.existsByMobileNumber(cleanMobile)) {
                throw new IllegalArgumentException("Mobile number " + cleanMobile + " is already in use by another customer.");
            }
            customer.setMobileNumber(cleanMobile);
        }
        if (request.getEmail() != null) {
            customer.setEmail(request.getEmail().trim());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            customer.setPassword(request.getPassword().trim());
        }

        return customerUserRepository.save(customer);
    }

    @Transactional
    public void deleteCustomerByAdmin(Long id) {
        if (!customerUserRepository.existsById(id)) {
            throw new IllegalArgumentException("Customer not found with ID: " + id);
        }
        customerUserRepository.deleteById(id);
    }

    @Transactional
    public AuthDto.AuthResponse updateCustomerProfile(AuthDto.UpdateCustomerProfileRequest request) {
        if (request.getMobileNumber() == null || request.getMobileNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Mobile number is required");
        }

        String cleanMobile = request.getMobileNumber().replaceAll("[^0-9]", "");
        if (cleanMobile.length() > 10) {
            cleanMobile = cleanMobile.substring(cleanMobile.length() - 10);
        }

        CustomerUser customer = customerUserRepository.findByMobileNumber(cleanMobile)
                .orElseThrow(() -> new IllegalArgumentException("Customer account not found"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            customer.setName(request.getName().trim());
        }
        if (request.getEmail() != null) {
            customer.setEmail(request.getEmail().trim());
        }
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getCurrentPassword() != null && !request.getCurrentPassword().equals(customer.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
            customer.setPassword(request.getNewPassword().trim());
        }

        customerUserRepository.save(customer);

        String token = jwtUtil.generateToken(customer.getMobileNumber(), customer.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .id(customer.getId())
                .username(customer.getMobileNumber())
                .name(customer.getName())
                .mobileNumber(customer.getMobileNumber())
                .email(customer.getEmail())
                .role(customer.getRole())
                .build();
    }

    @Transactional
    public AuthDto.AuthResponse customerGoogleLogin(AuthDto.GoogleLoginRequest request) {
        if (request.getIdToken() == null || request.getIdToken().trim().isEmpty()) {
            throw new IllegalArgumentException("Google ID Token is missing");
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(java.util.Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google ID Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String googleId = payload.getSubject();
            String email = payload.getEmail();
            String rawName = (String) payload.get("name");
            final String name = (rawName != null && !rawName.trim().isEmpty()) ? rawName : "Google Customer";

            CustomerUser customer = customerUserRepository.findByGoogleId(googleId)
                    .orElseGet(() -> {
                        if (email != null && !email.trim().isEmpty()) {
                            java.util.Optional<CustomerUser> existingByEmail = customerUserRepository.findByEmail(email.trim());
                            if (existingByEmail.isPresent()) {
                                CustomerUser existing = existingByEmail.get();
                                existing.setGoogleId(googleId);
                                if (existing.getAuthProvider() == null || "LOCAL".equals(existing.getAuthProvider())) {
                                    existing.setAuthProvider("GOOGLE");
                                }
                                return customerUserRepository.save(existing);
                            }
                        }
                        CustomerUser newUser = CustomerUser.builder()
                                .name(name)
                                .email(email)
                                .googleId(googleId)
                                .authProvider("GOOGLE")
                                .role("CUSTOMER")
                                .build();
                        return customerUserRepository.save(newUser);
                    });

            String userIdentifier = customer.getMobileNumber() != null ? customer.getMobileNumber() : (customer.getEmail() != null ? customer.getEmail() : customer.getGoogleId());
            String token = jwtUtil.generateToken(userIdentifier, customer.getRole());

            return AuthDto.AuthResponse.builder()
                    .token(token)
                    .id(customer.getId())
                    .username(userIdentifier)
                    .name(customer.getName())
                    .mobileNumber(customer.getMobileNumber())
                    .email(customer.getEmail())
                    .role(customer.getRole())
                    .build();
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to verify Google Sign-In: " + e.getMessage());
        }
    }
}
