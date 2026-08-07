package com.vinnavar.backend.modules.shipping.repository;

import com.vinnavar.backend.modules.shipping.entity.ShippingConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShippingConfigRepository extends JpaRepository<ShippingConfig, Long> {
    Optional<ShippingConfig> findByConfigKey(String configKey);
}
