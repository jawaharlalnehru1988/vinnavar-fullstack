package com.vinnavar.backend.modules.shipping.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shipping_configs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "config_key", nullable = false, unique = true)
    private String configKey;

    @Column(name = "config_value", nullable = false)
    private String configValue;

    @Column(name = "description")
    private String description;
}
