package com.vinnavar.backend.modules.shipping.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "shipping_rates", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"rate_type", "weight_kg"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rate_type", nullable = false)
    private String rateType; // "FORWARD" or "REVERSE"

    @Column(name = "weight_kg", nullable = false)
    private Double weightKg;

    @Column(name = "unit")
    private String unit;

    @Column(name = "local_rate", nullable = false)
    private BigDecimal localRate;

    @Column(name = "regional_rate", nullable = false)
    private BigDecimal regionalRate;

    @Column(name = "metro_rate", nullable = false)
    private BigDecimal metroRate;

    @Column(name = "national_rate", nullable = false)
    private BigDecimal nationalRate;

    @Column(name = "remote_rate", nullable = false)
    private BigDecimal remoteRate;
}
