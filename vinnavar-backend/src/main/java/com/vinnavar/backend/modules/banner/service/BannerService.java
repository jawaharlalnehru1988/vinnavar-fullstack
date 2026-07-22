package com.vinnavar.backend.modules.banner.service;

import com.vinnavar.backend.modules.banner.entity.Banner;
import com.vinnavar.backend.modules.banner.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<Banner> getActiveBanners() {
        return bannerRepository.findByActiveTrue();
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedDefaultBanners() {
        if (bannerRepository.count() > 0) {
            return;
        }

        Banner hero1 = Banner.builder()
                .title("SuperMarket Daily Fresh Organic Staples")
                .subtitle("Introduced a new model for online organic grocery shopping and convenient home delivery.")
                .buttonText("Shop Now")
                .linkUrl("#!")
                .imageUrl("/media/banners/slide-1.jpg")
                .bannerType("HERO_SLIDER")
                .build();

        Banner hero2 = Banner.builder()
                .title("100% Traditional Wood Pressed Oils")
                .subtitle("Pure unrefined cold-pressed oils made using traditional wooden mill techniques.")
                .buttonText("Shop Oils")
                .linkUrl("#!")
                .imageUrl("/media/banners/slider-2.jpg")
                .bannerType("HERO_SLIDER")
                .build();

        bannerRepository.saveAll(List.of(hero1, hero2));
    }
}
