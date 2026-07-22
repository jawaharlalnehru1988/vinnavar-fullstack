package com.vinnavar.backend.modules.setting.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String settingKey;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String settingValue;

    private String settingGroup; // LOGO, HERO_SLIDER, PROMO_BANNER, FOOTER, LABELS
    private String description;
}
