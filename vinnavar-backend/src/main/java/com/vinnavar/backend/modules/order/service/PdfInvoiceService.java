package com.vinnavar.backend.modules.order.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.entity.OrderItem;
import com.vinnavar.backend.modules.order.entity.ShippingAddress;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import com.vinnavar.backend.modules.shipping.service.ShippingService;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PdfInvoiceService {

    private final ShippingService shippingService;

    public ByteArrayInputStream generateOrderInvoicePdf(Order order) {
        Document document = new Document(PageSize.A4, 28, 28, 28, 28);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Background Mild Watermark (Dead Center)
            try {
                String logoPath = "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/Grocerylogo.png";
                java.io.File logoFile = new java.io.File(logoPath);
                if (logoFile.exists()) {
                    PdfContentByte canvas = writer.getDirectContentUnder();
                    canvas.saveState();
                    PdfGState gstate = new PdfGState();
                    gstate.setFillOpacity(0.10f);
                    gstate.setStrokeOpacity(0.10f);
                    canvas.setGState(gstate);

                    Image watermark = Image.getInstance(logoPath);
                    watermark.scaleToFit(320f, 320f);
                    float x = (PageSize.A4.getWidth() - watermark.getScaledWidth()) / 2;
                    float y = (PageSize.A4.getHeight() - watermark.getScaledHeight()) / 2;
                    watermark.setAbsolutePosition(x, y);

                    canvas.addImage(watermark);
                    canvas.restoreState();
                }
            } catch (Exception watermarkEx) {
                // Watermark fallback silently
            }

            // Colors
            Color emeraldDark = new Color(4, 120, 87);
            Color emeraldBg = new Color(236, 253, 245);
            Color borderGray = new Color(220, 225, 230);

            // Fonts
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.DARK_GRAY);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, emeraldDark);
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 15, emeraldDark);
            Font fontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.BLACK);
            Font fontRegular = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);
            Font fontSmall = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY);
            Font fontSmallBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.BLACK);
            Font fontItalic = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.DARK_GRAY);

            // 1. Header Section Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{3.2f, 1.8f});

            // Company Details (Left)
            PdfPCell cellLeft = new PdfPCell();
            cellLeft.setBorder(Rectangle.NO_BORDER);
            cellLeft.addElement(new Paragraph("VINNAVAR ORGANICS", headerFont));
            cellLeft.addElement(new Paragraph("LP Traders", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY)));
            cellLeft.addElement(new Paragraph("100% Pure & Certified Organic Produce", subHeaderFont));
            cellLeft.addElement(new Paragraph("Full Address: #16, MS Nagar Phase 2, Kurumanthangal Road, Kunnathur, Arani, TN - 632314", fontSmall));
            cellLeft.addElement(new Paragraph("GSTIN: 33AFOPL7097M1ZN | FSSAI Lic No: 22425479000675", fontSmallBold));
            cellLeft.addElement(new Paragraph("WhatsApp: +91 7550210447 | Email: vinnavarbrand@gmail.com", fontSmall));
            headerTable.addCell(cellLeft);

            // Invoice Title & Order Meta (Right)
            PdfPCell cellRight = new PdfPCell();
            cellRight.setBorder(Rectangle.NO_BORDER);
            cellRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph pInvoice = new Paragraph("TAX INVOICE / BILL", titleFont);
            pInvoice.setAlignment(Element.ALIGN_RIGHT);
            cellRight.addElement(pInvoice);

            Paragraph pDetails = new Paragraph(
                    "Invoice #: " + order.getOrderNumber() + "\n" +
                    "Date: " + (order.getCreatedAt() != null ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm")) : "N/A") + "\n" +
                    "Status: " + order.getOrderStatus() + " (" + order.getPaymentMethod() + ")",
                    fontRegular
            );
            pDetails.setAlignment(Element.ALIGN_RIGHT);
            cellRight.addElement(pDetails);
            headerTable.addCell(cellRight);

            document.add(headerTable);

            // Separator
            LineSeparator ls = new LineSeparator(1f, 100f, emeraldDark, Element.ALIGN_CENTER, -2);
            document.add(new Chunk(ls));
            document.add(new Paragraph(" "));

            // 2. Customer & Address Info Table
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{1f, 1f});

            // Shipping Address (No background color fill for full watermark visibility)
            ShippingAddress ship = order.getShippingAddress();
            PdfPCell shipCell = new PdfPCell();
            shipCell.setPadding(6);
            shipCell.setBorderColor(borderGray);
            shipCell.addElement(new Paragraph("SHIPPING ADDRESS (Full Address)", fontBold));
            shipCell.addElement(new Paragraph(order.getCustomerName(), fontRegular));
            shipCell.addElement(new Paragraph("Phone: " + order.getCustomerPhone() + " | Email: " + (order.getCustomerEmail() != null ? order.getCustomerEmail() : "N/A"), fontRegular));
            if (ship != null) {
                shipCell.addElement(new Paragraph(ship.getStreetAddress() + ", " + ship.getCity() + ", " + ship.getState() + " - " + ship.getPincode(), fontRegular));
            }
            if (order.getGstin() != null && !order.getGstin().isBlank()) {
                shipCell.addElement(new Paragraph("GSTIN: " + order.getGstin(), fontSmallBold));
            }
            infoTable.addCell(shipCell);

            // Billing Address (No background color fill)
            ShippingAddress bill = order.getBillingAddress();
            PdfPCell billCell = new PdfPCell();
            billCell.setPadding(6);
            billCell.setBorderColor(borderGray);
            billCell.addElement(new Paragraph("BILLING ADDRESS (Full Address)", fontBold));
            if (bill != null) {
                billCell.addElement(new Paragraph(bill.getFullName() != null ? bill.getFullName() : order.getCustomerName(), fontRegular));
                billCell.addElement(new Paragraph(bill.getStreetAddress() + ", " + bill.getCity() + ", " + bill.getState() + " - " + bill.getPincode(), fontRegular));
            } else {
                billCell.addElement(new Paragraph("Same as Shipping Address", fontRegular));
                if (ship != null) {
                    billCell.addElement(new Paragraph(ship.getStreetAddress() + ", " + ship.getCity() + ", " + ship.getState() + " - " + ship.getPincode(), fontRegular));
                }
            }
            String billGstin = (order.getGstin() != null && !order.getGstin().isBlank()) ? order.getGstin() : "Not Mandatory (if customer has)";
            billCell.addElement(new Paragraph("GSTIN No: " + billGstin, fontSmallBold));
            infoTable.addCell(billCell);

            document.add(infoTable);
            document.add(new Paragraph(" "));

            // 3. Items Table
            PdfPTable itemTable = new PdfPTable(8);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new float[]{0.4f, 3.1f, 0.9f, 0.5f, 1.0f, 1.0f, 1.1f, 1.2f});

            String[] headers = {"#", "Product Description", "HSN Code", "Qty", "MRP", "Discount %", "Unit Price", "Total (₹)"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell();
                cell.setBackgroundColor(emeraldDark);
                cell.setPadding(5);
                cell.setHorizontalAlignment(header.contains("Total") || header.contains("Price") || header.contains("MRP") || header.contains("Discount") ? Element.ALIGN_RIGHT : Element.ALIGN_LEFT);
                cell.setPhrase(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.WHITE)));
                itemTable.addCell(cell);
            }

            int index = 1;
            int totalQty = 0;
            BigDecimal calculatedTotalMrp = BigDecimal.ZERO;
            BigDecimal calculatedTotalSavings = BigDecimal.ZERO;

            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                    int qty = item.getQuantity() != null ? item.getQuantity() : 1;
                    totalQty += qty;
                    BigDecimal lineTotal = item.getTotalPrice() != null ? item.getTotalPrice() : unitPrice.multiply(BigDecimal.valueOf(qty));

                    String hsnCode = "1006";

                    BigDecimal mrp = unitPrice.multiply(new BigDecimal("1.15")).setScale(2, RoundingMode.HALF_UP);
                    BigDecimal lineMrpTotal = mrp.multiply(BigDecimal.valueOf(qty));
                    BigDecimal lineDiscountAmount = lineMrpTotal.subtract(lineTotal);

                    calculatedTotalMrp = calculatedTotalMrp.add(lineMrpTotal);
                    calculatedTotalSavings = calculatedTotalSavings.add(lineDiscountAmount);

                    double discountPercent = 13.0;

                    PdfPCell c1 = new PdfPCell(new Phrase(String.valueOf(index++), fontRegular));
                    c1.setPadding(4);
                    itemTable.addCell(c1);

                    PdfPCell c2 = new PdfPCell(new Phrase(item.getProductName() + " (" + item.getVariantName() + ")", fontRegular));
                    c2.setPadding(4);
                    itemTable.addCell(c2);

                    PdfPCell c3 = new PdfPCell(new Phrase(hsnCode, fontRegular));
                    c3.setPadding(4);
                    c3.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemTable.addCell(c3);

                    PdfPCell c4 = new PdfPCell(new Phrase(String.valueOf(qty), fontRegular));
                    c4.setPadding(4);
                    c4.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemTable.addCell(c4);

                    PdfPCell c5 = new PdfPCell(new Phrase("₹" + String.format("%.2f", mrp), fontRegular));
                    c5.setPadding(4);
                    c5.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c5);

                    PdfPCell c6 = new PdfPCell(new Phrase(String.format("%.0f%%", discountPercent), fontRegular));
                    c6.setPadding(4);
                    c6.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c6);

                    PdfPCell c7 = new PdfPCell(new Phrase("₹" + String.format("%.2f", unitPrice), fontRegular));
                    c7.setPadding(4);
                    c7.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c7);

                    PdfPCell c8 = new PdfPCell(new Phrase("₹" + String.format("%.2f", lineTotal), fontBold));
                    c8.setPadding(4);
                    c8.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c8);
                }
            }

            document.add(itemTable);
            document.add(new Paragraph(" "));

            // 4. Savings Banner & Breakdown Table Side-by-Side
            PdfPTable middleSection = new PdfPTable(2);
            middleSection.setWidthPercentage(100);
            middleSection.setWidths(new float[]{1.1f, 1f});

            BigDecimal subtotal = order.getSubtotal() != null ? order.getSubtotal() : BigDecimal.ZERO;
            double weight = order.getTotalWeightKg() != null ? order.getTotalWeightKg() : 0.5;
            String destState = order.getShippingAddress() != null ? order.getShippingAddress().getState() : "Tamil Nadu";
            String payMethod = order.getPaymentMethod() != null ? order.getPaymentMethod().name() : "ONLINE";

            com.vinnavar.backend.modules.shipping.service.ShippingService.ShippingCalculationResult calc =
                    shippingService.calculateShippingFee(weight, destState, payMethod, subtotal);
            BigDecimal shippingFee = order.getShippingFee() != null ? order.getShippingFee() : calc.getTotalShippingFee();

            BigDecimal productGst = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
            BigDecimal shippingGst = shippingFee.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
            BigDecimal totalGst = productGst.add(shippingGst);
            BigDecimal unroundedTotal = subtotal.add(shippingFee).add(totalGst).setScale(2, RoundingMode.HALF_UP);
            BigDecimal grandTotal = unroundedTotal.setScale(0, RoundingMode.FLOOR).setScale(2, RoundingMode.HALF_UP);
            BigDecimal roundOff = grandTotal.subtract(unroundedTotal).setScale(2, RoundingMode.HALF_UP);

            // Left Cell: You Have Saved Banner Box (No background color fill for full watermark visibility)
            PdfPCell savingsBoxCell = new PdfPCell();
            savingsBoxCell.setPadding(10);
            savingsBoxCell.setBorderColor(emeraldDark);
            savingsBoxCell.setBorderWidth(1.2f);
            
            Paragraph pSavedTitle = new Paragraph("You have saved:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, emeraldDark));
            Paragraph pSavedText = new Paragraph("Discount Applied in Rs. " + String.format("%.2f", calculatedTotalSavings) + " from this Order.", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK));
            pSavedText.setSpacingBefore(4f);

            savingsBoxCell.addElement(pSavedTitle);
            savingsBoxCell.addElement(pSavedText);
            middleSection.addCell(savingsBoxCell);

            // Right Cell: Totals Summary Table
            PdfPCell summaryCellWrapper = new PdfPCell();
            summaryCellWrapper.setBorder(Rectangle.NO_BORDER);

            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{1.7f, 1.3f});

            summaryTable.addCell(createSummaryLabelCell("MRP Total:", fontRegular));
            summaryTable.addCell(createSummaryValueCell("₹" + String.format("%.2f", calculatedTotalMrp), fontRegular));

            summaryTable.addCell(createSummaryLabelCell("Discount Amount Total:", fontRegular));
            summaryTable.addCell(createSummaryValueCell("- ₹" + String.format("%.2f", calculatedTotalSavings), fontRegular));

            summaryTable.addCell(createSummaryLabelCell("Base Price / Subtotal:", fontRegular));
            summaryTable.addCell(createSummaryValueCell("₹" + String.format("%.2f", subtotal), fontRegular));

            String shippingLabel = "Weight Based Shipping (" + String.format("%.1f", weight) + " kg, " + totalQty + " Qty):";
            summaryTable.addCell(createSummaryLabelCell(shippingLabel, fontRegular));
            summaryTable.addCell(createSummaryValueCell("₹" + String.format("%.2f", shippingFee), fontRegular));

            summaryTable.addCell(createSummaryLabelCell("Product GST Tax (5%):", fontRegular));
            summaryTable.addCell(createSummaryValueCell("₹" + String.format("%.2f", productGst), fontRegular));

            summaryTable.addCell(createSummaryLabelCell("Shipping GST Tax (18%):", fontRegular));
            summaryTable.addCell(createSummaryValueCell("₹" + String.format("%.2f", shippingGst), fontRegular));

            summaryTable.addCell(createSummaryLabelCell("Total GST Tax:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, emeraldDark)));
            summaryTable.addCell(createSummaryValueCell("₹" + String.format("%.2f", totalGst), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, emeraldDark)));

            if (roundOff.compareTo(BigDecimal.ZERO) != 0) {
                summaryTable.addCell(createSummaryLabelCell("Round Off:", fontRegular));
                summaryTable.addCell(createSummaryValueCell(String.format("%.2f", roundOff), fontRegular));
            }

            PdfPCell totalLblCell = createSummaryLabelCell("Grand Total:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, emeraldDark));
            totalLblCell.setBackgroundColor(emeraldBg);
            summaryTable.addCell(totalLblCell);

            PdfPCell totalValCell = createSummaryValueCell("₹" + String.format("%.2f", grandTotal), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, emeraldDark));
            totalValCell.setBackgroundColor(emeraldBg);
            summaryTable.addCell(totalValCell);

            summaryCellWrapper.addElement(summaryTable);
            middleSection.addCell(summaryCellWrapper);

            document.add(middleSection);
            document.add(new Paragraph(" "));

            // 5. Legal Terms & Disclaimers Section
            LineSeparator lsBottom = new LineSeparator(0.8f, 100f, borderGray, Element.ALIGN_CENTER, -2);
            document.add(new Chunk(lsBottom));

            Paragraph disclaimerHeader = new Paragraph("Disclaimer:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.BLACK));
            disclaimerHeader.setSpacingBefore(4f);
            document.add(disclaimerHeader);

            Paragraph disclaimerBody = new Paragraph(
                    "• Transport & Transit damages are not responsible by Seller. (Transit issues)\n" +
                    "• Goods Once Cannot be Return or Refund.\n" +
                    "• If Quality issue proved by Suitable evidence via Supporting Email Conversation, Valid Returns or Refunds Are Applied according to Refund policy.",
                    fontItalic
            );
            disclaimerBody.setSpacingAfter(6f);
            document.add(disclaimerBody);

            // 6. Sign-off & Jurisdiction Footer Table
            PdfPTable footerTable = new PdfPTable(2);
            footerTable.setWidthPercentage(100);
            footerTable.setWidths(new float[]{1.8f, 1.2f});

            // Left: Jurisdiction & Computer Generated Notice
            PdfPCell footLeft = new PdfPCell();
            footLeft.setBorder(Rectangle.NO_BORDER);
            footLeft.addElement(new Paragraph("Subjected to Arani Jurisdiction", fontSmallBold));
            footLeft.addElement(new Paragraph("This is a Computer Generated Invoice.", fontSmall));
            footerTable.addCell(footLeft);

            // Right: For Vinnavar Signature Block
            PdfPCell footRight = new PdfPCell();
            footRight.setBorder(Rectangle.NO_BORDER);
            footRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph pFor = new Paragraph("For Vinnavar Organics", fontBold);
            pFor.setAlignment(Element.ALIGN_RIGHT);
            footRight.addElement(pFor);

            // Embed Signature Image
            try {
                String sigPath = "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/signature.png";
                java.io.File sigFile = new java.io.File(sigPath);
                if (sigFile.exists()) {
                    Image sigImage = Image.getInstance(sigPath);
                    sigImage.scaleToFit(100f, 45f);
                    sigImage.setAlignment(Element.ALIGN_RIGHT);
                    footRight.addElement(sigImage);
                }
            } catch (Exception sigEx) {
                // Signature image fallback
            }

            Paragraph pSig = new Paragraph("(Authorized Signatory)", fontSmall);
            pSig.setAlignment(Element.ALIGN_RIGHT);
            footRight.addElement(pSig);
            footerTable.addCell(footRight);

            document.add(footerTable);

            Paragraph thankYouLine = new Paragraph("Thank you for choosing Vinnavar Organics! Visit Again! ✨", FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 10, emeraldDark));
            thankYouLine.setAlignment(Element.ALIGN_CENTER);
            thankYouLine.setSpacingBefore(10f);
            document.add(thankYouLine);

            document.close();
        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private PdfPCell createSummaryLabelCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(new Color(230, 235, 240));
        cell.setPadding(4);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        return cell;
    }

    private PdfPCell createSummaryValueCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(new Color(230, 235, 240));
        cell.setPadding(4);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return cell;
    }
}
