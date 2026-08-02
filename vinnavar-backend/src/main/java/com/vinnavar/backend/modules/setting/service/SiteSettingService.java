package com.vinnavar.backend.modules.setting.service;

import com.vinnavar.backend.modules.setting.entity.SiteSetting;
import com.vinnavar.backend.modules.setting.repository.SiteSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteSettingService {

    private final SiteSettingRepository repository;

    public Map<String, String> getAllSettingsAsMap() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SiteSetting::getSettingKey, SiteSetting::getSettingValue, (v1, v2) -> v1));
    }

    public List<SiteSetting> getAllSettings() {
        return repository.findAll();
    }

    @Transactional
    public SiteSetting updateSetting(String key, String value) {
        SiteSetting setting = repository.findBySettingKey(key)
                .orElseGet(() -> SiteSetting.builder().settingKey(key).settingGroup("CUSTOM").build());
        setting.setSettingValue(value);
        return repository.save(setting);
    }

    @Transactional
    public SiteSetting updateSettingFull(String key, String value, String description, String group) {
        SiteSetting setting = repository.findBySettingKey(key)
                .orElseGet(() -> SiteSetting.builder().settingKey(key).settingGroup("CUSTOM").build());
        if (value != null) setting.setSettingValue(value);
        if (description != null) setting.setDescription(description);
        if (group != null) setting.setSettingGroup(group);
        return repository.save(setting);
    }

    @Transactional
    public boolean deleteSetting(String key) {
        return repository.findBySettingKey(key).map(setting -> {
            repository.delete(setting);
            return true;
        }).orElse(false);
    }

    public String getSettingValue(String key, String defaultValue) {
        return repository.findBySettingKey(key)
                .map(SiteSetting::getSettingValue)
                .orElse(defaultValue);
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedDefaultSiteSettings() {
        List<SiteSetting> defaults = List.of(
                SiteSetting.builder().settingKey("store_name").settingValue("Vinnavar Organics").settingGroup("GENERAL").description("Brand Name").build(),
                SiteSetting.builder().settingKey("store_logo").settingValue("/media/site/Grocerylogo.png").settingGroup("LOGO").description("Header Logo Image").build(),
                SiteSetting.builder().settingKey("footer_logo").settingValue("/media/site/Grocerylogo.png").settingGroup("LOGO").description("Footer Logo Image").build(),
                SiteSetting.builder().settingKey("header_announcement").settingValue("Super Value Deals - 100% Pure Organic Staples").settingGroup("LABELS").description("Top Header Banner Text").build(),
                SiteSetting.builder().settingKey("home_hero_1").settingValue("/media/site/slide-1.jpg").settingGroup("HERO_SLIDER").description("Home Slide 1 Image").build(),
                SiteSetting.builder().settingKey("home_hero_2").settingValue("/media/site/slider-2.jpg").settingGroup("HERO_SLIDER").description("Home Slide 2 Image").build(),
                SiteSetting.builder().settingKey("ad_banner_1").settingValue("/media/site/ad-banner-1.jpg").settingGroup("PROMO_BANNER").description("Ad Banner 1").build(),
                SiteSetting.builder().settingKey("ad_banner_2").settingValue("/media/site/ad-banner-2.jpg").settingGroup("PROMO_BANNER").description("Ad Banner 2").build(),
                SiteSetting.builder().settingKey("ad_banner_3").settingValue("/media/site/ad-banner-3.jpg").settingGroup("PROMO_BANNER").description("Ad Banner 3").build(),
                SiteSetting.builder().settingKey("contact_phone").settingValue("+91 9876543210").settingGroup("FOOTER").description("Support Contact Phone").build(),
                SiteSetting.builder().settingKey("contact_email").settingValue("support@vinnavar.com").settingGroup("FOOTER").description("Support Contact Email").build(),
                SiteSetting.builder().settingKey("razorpay_key_id").settingValue("rzp_live_TKXASjwFtEAc4q").settingGroup("PAYMENT").description("Razorpay Key ID").build(),
                SiteSetting.builder().settingKey("razorpay_key_secret").settingValue("el8Go3BB2hWqL9098hIAwAnU").settingGroup("PAYMENT").description("Razorpay Key Secret").build()
        );

        for (SiteSetting def : defaults) {
            if (repository.findBySettingKey(def.getSettingKey()).isEmpty()) {
                repository.save(def);
            }
        }
    }
}
