package com.vinnavar.backend.modules.shipping.repository;

import com.vinnavar.backend.modules.shipping.entity.ShippingRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ShippingRateRepository extends JpaRepository<ShippingRate, Long> {

    List<ShippingRate> findByRateTypeOrderByWeightKgAsc(String rateType);

    Optional<ShippingRate> findByRateTypeAndWeightKg(String rateType, Double weightKg);

    @Query("SELECT r FROM ShippingRate r WHERE r.rateType = :rateType AND r.weightKg >= :weight ORDER BY r.weightKg ASC LIMIT 1")
    Optional<ShippingRate> findFirstMatchingSlab(@Param("rateType") String rateType, @Param("weight") Double weight);

    @Query("SELECT r FROM ShippingRate r WHERE r.rateType = :rateType ORDER BY r.weightKg DESC LIMIT 1")
    Optional<ShippingRate> findMaxWeightSlab(@Param("rateType") String rateType);
}
