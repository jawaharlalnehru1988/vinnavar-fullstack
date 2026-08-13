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
                SiteSetting.builder().settingKey("store_logo").settingValue("/media/site/logo_vinnavar.webp").settingGroup("LOGO").description("Header Logo Image").build(),
                SiteSetting.builder().settingKey("footer_logo").settingValue("/media/site/logo_vinnavar.webp").settingGroup("LOGO").description("Footer Logo Image").build(),
                SiteSetting.builder().settingKey("header_announcement").settingValue("Super Value Deals - 100% Pure Organic Staples").settingGroup("LABELS").description("Top Header Banner Text").build(),
                SiteSetting.builder().settingKey("home_hero_1").settingValue("/media/site/slide-1.jpg").settingGroup("HERO_SLIDER").description("Home Slide 1 Image").build(),
                SiteSetting.builder().settingKey("home_hero_2").settingValue("/media/site/slider-2.jpg").settingGroup("HERO_SLIDER").description("Home Slide 2 Image").build(),
                SiteSetting.builder().settingKey("ad_banner_1").settingValue("/media/site/ad-banner-1.jpg").settingGroup("PROMO_BANNER").description("Ad Banner 1").build(),
                SiteSetting.builder().settingKey("ad_banner_2").settingValue("/media/site/ad-banner-2.jpg").settingGroup("PROMO_BANNER").description("Ad Banner 2").build(),
                SiteSetting.builder().settingKey("ad_banner_3").settingValue("/media/site/ad-banner-3.jpg").settingGroup("PROMO_BANNER").description("Ad Banner 3").build(),
                SiteSetting.builder().settingKey("contact_phone").settingValue("+91 9876543210").settingGroup("FOOTER").description("Support Contact Phone").build(),
                SiteSetting.builder().settingKey("contact_email").settingValue("support@vinnavar.com").settingGroup("FOOTER").description("Support Contact Email").build(),
                SiteSetting.builder().settingKey("razorpay_key_id").settingValue(System.getenv().getOrDefault("RAZORPAY_KEY_ID", "")).settingGroup("PAYMENT").description("Razorpay Key ID").build(),
                SiteSetting.builder().settingKey("razorpay_key_secret").settingValue(System.getenv().getOrDefault("RAZORPAY_KEY_SECRET", "")).settingGroup("PAYMENT").description("Razorpay Key Secret").build(),
                SiteSetting.builder().settingKey("refund_policy").settingValue("Vinnavar Organics Refund Policy:\n\n1. Returns & Replacements: We take utmost care in delivering 100% genuine traditional organic rice, cold-pressed oils, and spices. If you receive a damaged or defective package, please notify us within 48 hours of delivery.\n\n2. Refund Eligibility: Approved refunds will be processed back to your original payment method within 5-7 business days.\n\n3. Cancellations: Orders can be cancelled prior to dispatch by contacting our customer care desk.").settingGroup("POLICIES").description("Refund & Cancellation Policy Text").build(),
                SiteSetting.builder().settingKey("privacy_policy").settingValue("Vinnavar Organics Privacy Policy:\n\n1. Data Protection: We respect your privacy and are committed to protecting your personal information. Customer details (name, address, phone number, email) are collected strictly for order processing and delivery fulfillment.\n\n2. Payment Security: All online transactions are processed through RBI-approved PCI-compliant gateways (Razorpay). We do not store raw credit card CVVs or bank credentials.\n\n3. Data Sharing: Your personal information is never sold, rented, or shared with third parties.").settingGroup("POLICIES").description("Privacy Policy Text").build(),
                SiteSetting.builder().settingKey("terms_conditions").settingValue("Vinnavar Organics Terms & Conditions:\n\n1. Acceptance: By accessing or purchasing from Vinnavar Organics, you agree to comply with our store terms and policies.\n\n2. Product Availability & Pricing: All prices displayed are inclusive of applicable taxes. Product availability is subject to seasonal organic crop yields.\n\n3. Delivery Terms: Orders are dispatched within 24-48 hours. Shipping fees are calculated transparently based on total package weight.").settingGroup("POLICIES").description("Terms & Conditions Text").build()
        );

        for (SiteSetting def : defaults) {
            repository.findBySettingKey(def.getSettingKey()).ifPresentOrElse(
                existing -> {
                    if (existing.getSettingValue() != null && 
                       (existing.getSettingValue().contains("Grocerylogo") || 
                        existing.getSettingValue().contains("vinnavar_logo") || 
                        existing.getSettingValue().contains("logo.png"))) {
                        existing.setSettingValue(def.getSettingValue());
                        repository.save(existing);
                    }
                },
                () -> repository.save(def)
            );
        }

        // Physically synchronize all legacy logo paths and favicon with the new logo
        try {
            java.nio.file.Path sourcePath = java.nio.file.Paths.get("/var/www/vinnavar-fullstack/vinnavar-frontend/public/logo_vinnavar.webp");
            if (java.nio.file.Files.exists(sourcePath)) {
                byte[] webpBytes = java.nio.file.Files.readAllBytes(sourcePath);

                // 1. Delete old favicon.ico and write valid ICO file from logo_vinnavar.webp
                java.nio.file.Path faviconTarget = java.nio.file.Paths.get("/var/www/vinnavar-fullstack/vinnavar-frontend/public/favicon.ico");
                java.nio.file.Files.deleteIfExists(faviconTarget);

                byte[] icoHeader = new byte[]{
                    0, 0, 1, 0, 1, 0,
                    0, 0, 0, 0, 1, 0, 32, 0
                };
                byte[] sizeBytes = java.nio.ByteBuffer.allocate(4).order(java.nio.ByteOrder.LITTLE_ENDIAN).putInt(webpBytes.length).array();
                byte[] offsetBytes = java.nio.ByteBuffer.allocate(4).order(java.nio.ByteOrder.LITTLE_ENDIAN).putInt(22).array();

                byte[] icoContent = new byte[22 + webpBytes.length];
                System.arraycopy(icoHeader, 0, icoContent, 0, 14);
                System.arraycopy(sizeBytes, 0, icoContent, 14, 4);
                System.arraycopy(offsetBytes, 0, icoContent, 18, 4);
                System.arraycopy(webpBytes, 0, icoContent, 22, webpBytes.length);

                java.nio.file.Files.write(faviconTarget, icoContent);

                // 2. Synchronize target media paths
                java.nio.file.Path[] targetPaths = new java.nio.file.Path[]{
                    java.nio.file.Paths.get("/var/www/vinnavar-fullstack/vinnavar-frontend/public/logo192.png"),
                    java.nio.file.Paths.get("/var/www/vinnavar-fullstack/vinnavar-frontend/public/logo512.png"),
                    java.nio.file.Paths.get("/var/www/vinnavar-fullstack/vinnavar-backend/media/site/Grocerylogo.png"),
                    java.nio.file.Paths.get("/var/www/vinnavar-fullstack/vinnavar-backend/media/site/vinnavar_logo.png"),
                    java.nio.file.Paths.get("/var/www/vinnavar-fullstack/vinnavar-backend/media/site/logo.png"),
                    java.nio.file.Paths.get("/var/www/vinnavar-fullstack/vinnavar-backend/media/site/logo_vinnavar.webp")
                };
                for (java.nio.file.Path target : targetPaths) {
                    if (target.getParent() != null) {
                        java.nio.file.Files.createDirectories(target.getParent());
                    }
                    java.nio.file.Files.copy(sourcePath, target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                }
            }
        } catch (Exception e) {
            // Ignore file sync exceptions
        }
    }
}
