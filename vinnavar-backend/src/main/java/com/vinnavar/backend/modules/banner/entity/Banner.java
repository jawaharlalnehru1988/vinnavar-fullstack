package com.vinnavar.backend.modules.banner.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String subtitle;
    private String buttonText;
    private String linkUrl;
    private String imageUrl;
    private String bannerType; // HERO_SLIDER, PROMO_BANNER

    @Builder.Default
    private boolean active = true;
}
