package com.vinnavar.backend.modules.shipping.service;

import com.vinnavar.backend.modules.shipping.entity.ShippingConfig;
import com.vinnavar.backend.modules.shipping.entity.ShippingRate;
import com.vinnavar.backend.modules.shipping.repository.ShippingConfigRepository;
import com.vinnavar.backend.modules.shipping.repository.ShippingRateRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShippingService {

    private final ShippingRateRepository rateRepository;
    private final ShippingConfigRepository configRepository;
    private final com.vinnavar.backend.modules.order.repository.OrderRepository orderRepository;

    private static final String EXCEL_PATH = "/var/www/vinnavar-fullstack/SWA-IN-OA.xlsx";

    @EventListener(ApplicationReadyEvent.class)
    public void seedInitialDataIfEmpty() {
        if (rateRepository.count() == 0) {
            log.info("Shipping rates database table is empty. Seeding from Excel: {}", EXCEL_PATH);
            seedFromExcel();
        } else {
            recalculateAllOrders();
        }
    }

    @Transactional
    public void seedFromExcel() {
        File file = new File(EXCEL_PATH);
        if (!file.exists()) {
            log.warn("Excel rate card file not found at: {}", EXCEL_PATH);
            return;
        }

        try (FileInputStream fis = new FileInputStream(file);
             Workbook workbook = new XSSFWorkbook(fis)) {

            // 1. Seed Configurations
            Sheet configSheet = workbook.getSheet("Configurations");
            if (configSheet != null) {
                for (int r = 1; r <= configSheet.getLastRowNum(); r++) {
                    Row row = configSheet.getRow(r);
                    if (row == null) continue;
                    Cell keyCell = row.getCell(0);
                    Cell valCell = row.getCell(1);
                    if (keyCell != null && valCell != null) {
                        String key = keyCell.getStringCellValue().trim();
                        String val = String.valueOf(getNumericOrStringValue(valCell));
                        saveConfigIfAbsent(key, val, "Seeded from Excel Configurations sheet");
                    }
                }
            }

            // 2. Seed ForwardLegRateCard
            Sheet forwardSheet = workbook.getSheet("ForwardLegRateCard");
            if (forwardSheet != null) {
                parseAndSaveSheetRates(forwardSheet, "FORWARD");
            }

            // 3. Seed ReverseLegRateCard
            Sheet reverseSheet = workbook.getSheet("ReverseLegRateCard");
            if (reverseSheet != null) {
                parseAndSaveSheetRates(reverseSheet, "REVERSE");
            }

            log.info("Successfully seeded shipping rates and configurations from Excel file.");
            recalculateAllOrders();
        } catch (Exception e) {
            log.error("Failed to parse and seed Excel rate card: ", e);
        }
    }

    @Transactional
    public void recalculateAllOrders() {
        try {
            List<com.vinnavar.backend.modules.order.entity.Order> orders = orderRepository.findAll();
            for (com.vinnavar.backend.modules.order.entity.Order o : orders) {
                double w = o.getTotalWeightKg();
                String st = o.getShippingAddress() != null ? o.getShippingAddress().getState() : "Tamil Nadu";
                String pm = o.getPaymentMethod() != null ? o.getPaymentMethod().name() : "ONLINE";
                BigDecimal sub = o.getSubtotal();

                ShippingCalculationResult calc = calculateShippingFee(w, st, pm, sub);
                BigDecimal sf = calc.getTotalShippingFee();
                BigDecimal productGst = sub.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
                BigDecimal shippingGst = sf.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
                BigDecimal gst = productGst.add(shippingGst);
                BigDecimal tot = sub.add(sf).add(gst).setScale(2, RoundingMode.HALF_UP);

                o.setTotalWeightKg(w);
                o.setShippingFee(sf);
                o.setGstTax(gst);
                o.setTotalAmount(tot);
                orderRepository.save(o);
            }
            log.info("Recalculated shipping fees and grand totals for {} existing orders.", orders.size());
        } catch (Exception e) {
            log.error("Error recalculating existing order shipping fees: ", e);
        }
    }

    private void parseAndSaveSheetRates(Sheet sheet, String rateType) {
        for (int r = 0; r <= sheet.getLastRowNum(); r++) {
            Row row = sheet.getRow(r);
            if (row == null) continue;

            Cell weightCell = row.getCell(0);
            Double weight = getCellDoubleValue(weightCell);
            if (weight == null) continue; // Skip header/title rows safely!

            Cell unitCell = row.getCell(1);
            String unit = "kg";
            if (unitCell != null) {
                if (unitCell.getCellType() == CellType.STRING) {
                    unit = unitCell.getStringCellValue().trim();
                } else if (unitCell.getCellType() == CellType.NUMERIC) {
                    unit = String.valueOf(unitCell.getNumericCellValue());
                }
            }

            BigDecimal local = getCellBigDecimal(row.getCell(2));
            BigDecimal regional = getCellBigDecimal(row.getCell(3));
            BigDecimal metro = getCellBigDecimal(row.getCell(4));
            BigDecimal national = getCellBigDecimal(row.getCell(5));
            BigDecimal remote = getCellBigDecimal(row.getCell(6));

            final String finalUnit = unit;
            Optional<ShippingRate> existing = rateRepository.findByRateTypeAndWeightKg(rateType, weight);
            ShippingRate rate = existing.orElseGet(() -> ShippingRate.builder()
                    .rateType(rateType)
                    .weightKg(weight)
                    .unit(finalUnit)
                    .build());

            rate.setLocalRate(local);
            rate.setRegionalRate(regional);
            rate.setMetroRate(metro);
            rate.setNationalRate(national);
            rate.setRemoteRate(remote);

            rateRepository.save(rate);
        }
    }

    private Double getCellDoubleValue(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) return null;
        if (cell.getCellType() == CellType.NUMERIC) return cell.getNumericCellValue();
        if (cell.getCellType() == CellType.STRING) {
            try {
                String str = cell.getStringCellValue().trim().replaceAll("[^0-9.]", "");
                return str.isEmpty() ? null : Double.parseDouble(str);
            } catch (Exception e) {
                return null;
            }
        }
        if (cell.getCellType() == CellType.FORMULA) {
            try {
                return cell.getNumericCellValue();
            } catch (Exception e) {
                try {
                    String str = cell.getStringCellValue().trim().replaceAll("[^0-9.]", "");
                    return str.isEmpty() ? null : Double.parseDouble(str);
                } catch (Exception ignored) {}
            }
        }
        return null;
    }

    private BigDecimal getCellBigDecimal(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) return BigDecimal.ZERO;
        if (cell.getCellType() == CellType.NUMERIC) {
            return BigDecimal.valueOf(cell.getNumericCellValue()).setScale(2, RoundingMode.HALF_UP);
        }
        if (cell.getCellType() == CellType.STRING) {
            try {
                String str = cell.getStringCellValue().trim().replaceAll("[^0-9.]", "");
                return str.isEmpty() ? BigDecimal.ZERO : new BigDecimal(str).setScale(2, RoundingMode.HALF_UP);
            } catch (Exception e) {
                return BigDecimal.ZERO;
            }
        }
        if (cell.getCellType() == CellType.FORMULA) {
            try {
                return BigDecimal.valueOf(cell.getNumericCellValue()).setScale(2, RoundingMode.HALF_UP);
            } catch (Exception e) {
                try {
                    String str = cell.getStringCellValue().trim().replaceAll("[^0-9.]", "");
                    return str.isEmpty() ? BigDecimal.ZERO : new BigDecimal(str).setScale(2, RoundingMode.HALF_UP);
                } catch (Exception ignored) {}
            }
        }
        return BigDecimal.ZERO;
    }

    private Object getNumericOrStringValue(Cell cell) {
        if (cell.getCellType() == CellType.NUMERIC) return cell.getNumericCellValue();
        if (cell.getCellType() == CellType.BOOLEAN) return cell.getBooleanCellValue();
        return cell.getStringCellValue();
    }

    private void saveConfigIfAbsent(String key, String value, String desc) {
        if (configRepository.findByConfigKey(key).isEmpty()) {
            configRepository.save(ShippingConfig.builder()
                    .configKey(key)
                    .configValue(value)
                    .description(desc)
                    .build());
        }
    }

    // Zone Resolution
    public String resolveZone(String stateName) {
        if (stateName == null || stateName.isBlank()) {
            return "LOCAL"; // Default to Local (Tamil Nadu)
        }
        String s = stateName.trim().toLowerCase();

        if (s.contains("tamil nadu") || s.equals("tn") || s.contains("pondicherry") || s.contains("puducherry")) {
            return "LOCAL";
        }
        if (s.contains("kerala") || s.contains("karnataka") || s.contains("andhra") || s.contains("telangana")) {
            return "REGIONAL";
        }
        if (s.contains("maharashtra") || s.contains("delhi") || s.contains("bengaluru") || s.contains("mumbai") || s.contains("kolkata")) {
            return "METRO";
        }
        if (s.contains("assam") || s.contains("meghalaya") || s.contains("manipur") || s.contains("mizoram") ||
            s.contains("nagaland") || s.contains("tripura") || s.contains("arunachal") || s.contains("sikkim") ||
            s.contains("jammu") || s.contains("kashmir") || s.contains("ladakh") || s.contains("andaman") || s.contains("lakshadweep")) {
            return "REMOTE";
        }
        return "NATIONAL";
    }

    @Transactional(readOnly = true)
    public ShippingCalculationResult calculateShippingFee(double totalWeightKg, String destinationState, String paymentMethod, BigDecimal orderSubtotal) {
        double weight = totalWeightKg <= 0 ? 0.5 : totalWeightKg;
        String zone = resolveZone(destinationState);

        // Find closest slab >= weight
        Optional<ShippingRate> rateOpt = rateRepository.findFirstMatchingSlab("FORWARD", weight);
        if (rateOpt.isEmpty()) {
            rateOpt = rateRepository.findMaxWeightSlab("FORWARD");
        }

        BigDecimal baseRate = BigDecimal.ZERO;
        double slabWeight = weight;
        if (rateOpt.isPresent()) {
            ShippingRate rate = rateOpt.get();
            slabWeight = rate.getWeightKg();
            switch (zone) {
                case "LOCAL" -> baseRate = rate.getLocalRate();
                case "REGIONAL" -> baseRate = rate.getRegionalRate();
                case "METRO" -> baseRate = rate.getMetroRate();
                case "REMOTE" -> baseRate = rate.getRemoteRate();
                default -> baseRate = rate.getNationalRate();
            }
        } else {
            baseRate = new BigDecimal("48.00");
        }

        BigDecimal codFixedFee = BigDecimal.ZERO;
        BigDecimal codVarFee = BigDecimal.ZERO;

        if ("COD".equalsIgnoreCase(paymentMethod)) {
            String fixedStr = configRepository.findByConfigKey("COD Fixed").map(ShippingConfig::getConfigValue).orElse("10.0");
            try {
                codFixedFee = new BigDecimal(fixedStr).setScale(2, RoundingMode.HALF_UP);
            } catch (Exception e) {
                codFixedFee = new BigDecimal("10.00");
            }

            String varStr = configRepository.findByConfigKey("COD Variable (%)").map(ShippingConfig::getConfigValue).orElse("0.0");
            try {
                BigDecimal varPercent = new BigDecimal(varStr);
                if (orderSubtotal != null && orderSubtotal.compareTo(BigDecimal.ZERO) > 0 && varPercent.compareTo(BigDecimal.ZERO) > 0) {
                    codVarFee = orderSubtotal.multiply(varPercent).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                }
            } catch (Exception ignored) {}
        }

        BigDecimal totalShippingFee = baseRate.add(codFixedFee).add(codVarFee).setScale(2, RoundingMode.HALF_UP);

        return ShippingCalculationResult.builder()
                .totalWeightKg(totalWeightKg)
                .appliedSlabKg(slabWeight)
                .zone(zone)
                .baseShippingFee(baseRate)
                .codFixedFee(codFixedFee)
                .codVariableFee(codVarFee)
                .totalShippingFee(totalShippingFee)
                .build();
    }

    // Admin methods
    @Transactional(readOnly = true)
    public List<ShippingRate> getAllRates(String rateType) {
        String type = rateType != null ? rateType.toUpperCase() : "FORWARD";
        return rateRepository.findByRateTypeOrderByWeightKgAsc(type);
    }

    @Transactional
    public ShippingRate updateRate(Long rateId, ShippingRate updatedRate) {
        ShippingRate existing = rateRepository.findById(rateId)
                .orElseThrow(() -> new IllegalArgumentException("Shipping rate slab not found with ID: " + rateId));

        if (updatedRate.getLocalRate() != null) existing.setLocalRate(updatedRate.getLocalRate());
        if (updatedRate.getRegionalRate() != null) existing.setRegionalRate(updatedRate.getRegionalRate());
        if (updatedRate.getMetroRate() != null) existing.setMetroRate(updatedRate.getMetroRate());
        if (updatedRate.getNationalRate() != null) existing.setNationalRate(updatedRate.getNationalRate());
        if (updatedRate.getRemoteRate() != null) existing.setRemoteRate(updatedRate.getRemoteRate());

        return rateRepository.save(existing);
    }

    @Transactional(readOnly = true)
    public List<ShippingConfig> getAllConfigs() {
        return configRepository.findAll();
    }

    @Transactional
    public ShippingConfig updateConfig(String configKey, String configValue) {
        ShippingConfig config = configRepository.findByConfigKey(configKey)
                .orElseGet(() -> ShippingConfig.builder().configKey(configKey).build());
        config.setConfigValue(configValue);
        return configRepository.save(config);
    }

    @Data
    @Builder
    public static class ShippingCalculationResult {
        private double totalWeightKg;
        private double appliedSlabKg;
        private String zone;
        private BigDecimal baseShippingFee;
        private BigDecimal codFixedFee;
        private BigDecimal codVariableFee;
        private BigDecimal totalShippingFee;
    }
}
