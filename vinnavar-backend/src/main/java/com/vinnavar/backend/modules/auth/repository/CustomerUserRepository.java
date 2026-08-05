package com.vinnavar.backend.modules.auth.repository;

import com.vinnavar.backend.modules.auth.entity.CustomerUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerUserRepository extends JpaRepository<CustomerUser, Long> {
    Optional<CustomerUser> findByMobileNumber(String mobileNumber);
    Optional<CustomerUser> findByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
}
