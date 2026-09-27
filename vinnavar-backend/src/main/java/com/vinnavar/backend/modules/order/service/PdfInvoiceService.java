package com.vinnavar.backend.modules.order.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.entity.OrderItem;
import com.vinnavar.backend.modules.order.entity.ShippingAddress;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import com.vinnavar.backend.modules.product.entity.Product;
import com.vinnavar.backend.modules.product.entity.ProductVariant;
import com.vinnavar.backend.modules.product.repository.ProductRepository;

@Service
@RequiredArgsConstructor
public class PdfInvoiceService {

    private final ProductRepository productRepository;

    /**
     * Resizes an image file to max dimensions and returns compressed JPEG bytes.
     * Keeps embedded image data tiny to minimize PDF file size.
     */
    private byte[] resizeImageToJpeg(java.io.File file, int maxWidth, int maxHeight, float jpegQuality) {
        try {
            BufferedImage src = ImageIO.read(file);
            if (src == null) return null;
            int srcW = src.getWidth();
            int srcH = src.getHeight();
            double scale = Math.min((double) maxWidth / srcW, (double) maxHeight / srcH);
            int targetW = Math.max(1, (int) (srcW * scale));
            int targetH = Math.max(1, (int) (srcH * scale));
            BufferedImage resized = new BufferedImage(targetW, targetH, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = resized.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.setColor(java.awt.Color.WHITE);
            g.fillRect(0, 0, targetW, targetH);
            g.drawImage(src, 0, 0, targetW, targetH, null);
            g.dispose();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            javax.imageio.ImageWriter jpegWriter = ImageIO.getImageWritersByFormatName("jpeg").next();
            javax.imageio.stream.ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
            jpegWriter.setOutput(ios);
            javax.imageio.IIOImage iioImage = new javax.imageio.IIOImage(resized, null, null);
            javax.imageio.ImageWriteParam param = jpegWriter.getDefaultWriteParam();
            param.setCompressionMode(javax.imageio.ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(jpegQuality);
            jpegWriter.write(null, iioImage, param);
            jpegWriter.dispose();
            ios.close();
            return baos.toByteArray();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Calculates the Indian Financial Year (e.g., "26-27") based on a given date.
     * The financial year runs from April 1 to March 31.
     */
    private String getFinancialYear(java.time.temporal.TemporalAccessor date) {
        if (date == null) {
            date = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Kolkata"));
        }
        int year = date.get(java.time.temporal.ChronoField.YEAR);
        int month = date.get(java.time.temporal.ChronoField.MONTH_OF_YEAR);
        int startYear, endYear;
        if (month >= 4) {
            startYear = year;
            endYear = year + 1;
        } else {
            startYear = year - 1;
            endYear = year;
        }
        return String.format("%02d-%02d", startYear % 100, endYear % 100);
    }

    public ByteArrayInputStream generateOrderInvoicePdf(Order order) {
        Document document = new Document(PageSize.A4, 28, 28, 28, 28);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            // Enable maximum PDF-level compression to minimize file size
            writer.setFullCompression();
            writer.setCompressionLevel(9);
            document.open();



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

            // 1. Header Section Table (Single Horizontal Row: Logo | Company Details | Invoice Metadata)
            PdfPTable headerTable = new PdfPTable(3);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{0.9f, 2.6f, 1.5f}); // Increased col 1 width for larger logo

            // Column 1: Logo Image (Far Left)
            PdfPCell logoCell = new PdfPCell();
            logoCell.setBorder(Rectangle.NO_BORDER);
            logoCell.setPaddingRight(8f);
            logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            try {
                String[] possibleLogoPaths = {
                    "/var/www/myclients-fullstacts/vinnavar-fullstack/vinnavar-backend/media/site/logo_vinnavar.png",
                    "/var/www/myclients-fullstacts/vinnavar-fullstack/vinnavar-frontend/public/logo_vinnavar.png",
                    "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/logo_vinnavar.png",
                    "/var/www/vinnavar-fullstack/vinnavar-frontend/public/logo_vinnavar.png",
                    "/var/www/vinnavar-fullstack/vinnavar-frontend/public/logo_vinnavar.webp",
                    "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/logo_vinnavar.webp",
                    "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/Grocerylogo.png"
                };
                java.io.File logoFile = null;
                for (String p : possibleLogoPaths) {
                    java.io.File f = new java.io.File(p);
                    if (f.exists()) {
                        logoFile = f;
                        break;
                    }
                }
                if (logoFile != null) {
                    Image logo = null;
                    byte[] logoBytes = resizeImageToJpeg(logoFile, 200, 200, 0.95f);
                    if (logoBytes != null) {
                        logo = Image.getInstance(logoBytes);
                    } else {
                        logo = Image.getInstance(logoFile.getAbsolutePath());
                    }
                    if (logo != null) {
                        logo.scaleToFit(76f, 76f); // 2x larger
                        logo.setAlignment(Element.ALIGN_CENTER);
                        logoCell.addElement(logo);
                    }
                }
            } catch (Exception e) {
                // Logo fallback
            }
            headerTable.addCell(logoCell);

            // Column 2: Company Brand & Address Details (Middle Left)
            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);
            companyCell.addElement(new Paragraph("VINNAVAR ORGANICS", headerFont));
            companyCell.addElement(new Paragraph("LP Traders", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY)));
            companyCell.addElement(new Paragraph("100% Pure & Certified Organic Produce", subHeaderFont));
            companyCell.addElement(new Paragraph("Full Address: #16, MS Nagar Phase 2, Kurumanthangal Road, Kunnathur, Arani, TN - 632314", fontSmall));
            companyCell.addElement(new Paragraph("GSTIN: 33AFOPL7097M1ZN | FSSAI Lic No: 22425479000675", fontSmallBold));
            companyCell.addElement(new Paragraph("WhatsApp: +91 7550210447 | Email: vinnavarbrand@gmail.com", fontSmall));
            headerTable.addCell(companyCell);

            // Column 3: Invoice Title & Order Meta (Right)
            PdfPCell cellRight = new PdfPCell();
            cellRight.setBorder(Rectangle.NO_BORDER);
            cellRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph pInvoice = new Paragraph("Order Confirmation / Delivery Challan", titleFont);
            pInvoice.setAlignment(Element.ALIGN_RIGHT);
            cellRight.addElement(pInvoice);

            Paragraph pDetails = new Paragraph(
                    "Document #: VIN/" + getFinancialYear(order.getCreatedAt()) + "/" + String.format("%04d", order.getId()) + "\n" +
                    "Date: " + (order.getCreatedAt() != null ? order.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm")) : "N/A") + "\n" +
                    "Status: " + (order.getOrderStatus() != null ? order.getOrderStatus().name() : "CONFIRMED") + 
                    (order.getPaymentMethod() != null ? " (" + order.getPaymentMethod() + ")" : ""),
                    fontSmallBold
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

            // 3. Items Table (with MRP, Unit Price, Discount, Your Savings)
            PdfPTable itemTable = new PdfPTable(9);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new float[]{0.4f, 2.8f, 0.9f, 0.5f, 1.0f, 1.0f, 0.9f, 1.2f, 1.1f});

            Font tableHdrFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, Color.WHITE);
            Font tableCellFont = FontFactory.getFont(FontFactory.HELVETICA, 7.5f, Color.BLACK);
            Font tableCellBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, Color.BLACK);
            Font tableSavingsFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, new Color(4, 120, 87));

            String[] headers = {"#", "Product Description", "HSN Code", "Qty", "MRP", "Unit Price", "Discount", "Your Savings", "Total (Rs.)"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell();
                cell.setBackgroundColor(emeraldDark);
                cell.setPadding(4.5f);
                if (header.contains("Total") || header.contains("Price") || header.contains("MRP") || header.contains("Savings")) {
                    cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                } else if (header.contains("Qty") || header.contains("HSN") || header.contains("Discount") || header.equals("#")) {
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                } else {
                    cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                }
                cell.setPhrase(new Phrase(header, tableHdrFont));
                itemTable.addCell(cell);
            }

            int index = 1;
            int totalQty = 0;
            BigDecimal totalOrderSavings = BigDecimal.ZERO;

            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                    int qty = item.getQuantity() != null ? item.getQuantity() : 1;
                    totalQty += qty;
                    BigDecimal lineTotal = item.getTotalPrice() != null ? item.getTotalPrice() : unitPrice.multiply(BigDecimal.valueOf(qty));

                    // Lookup MRP from Product and ProductVariant
                    BigDecimal mrp = unitPrice;
                    try {
                        Product product = null;
                        if (item.getProductId() != null) {
                            product = productRepository.findById(item.getProductId()).orElse(null);
                        }
                        if (product == null && item.getProductName() != null) {
                            product = productRepository.findAll().stream()
                                    .filter(p -> p.getName() != null && p.getName().trim().equalsIgnoreCase(item.getProductName().trim()))
                                    .findFirst()
                                    .orElse(null);
                        }
                        if (product != null && product.getVariants() != null && !product.getVariants().isEmpty()) {
                            ProductVariant matched = null;
                            if (item.getVariantName() != null && !item.getVariantName().isBlank()) {
                                matched = product.getVariants().stream()
                                        .filter(v -> v.getVariantName() != null && v.getVariantName().trim().equalsIgnoreCase(item.getVariantName().trim()))
                                        .findFirst()
                                        .orElse(null);
                            }
                            if (matched == null) {
                                matched = product.getVariants().stream()
                                        .filter(ProductVariant::isDefault)
                                        .findFirst()
                                        .orElse(product.getVariants().get(0));
                            }
                            if (matched != null && matched.getPrice() != null && matched.getPrice().compareTo(BigDecimal.ZERO) > 0) {
                                mrp = matched.getPrice();
                            }
                        }
                    } catch (Exception e) {
                        mrp = unitPrice;
                    }

                    if (mrp.compareTo(unitPrice) < 0) {
                        mrp = unitPrice;
                    }

                    BigDecimal discountPerUnit = mrp.subtract(unitPrice);
                    BigDecimal lineSavings = discountPerUnit.multiply(BigDecimal.valueOf(qty));
                    totalOrderSavings = totalOrderSavings.add(lineSavings);

                    String discountStr = "-";
                    if (mrp.compareTo(BigDecimal.ZERO) > 0 && discountPerUnit.compareTo(BigDecimal.ZERO) > 0) {
                        int discountPercent = (int) Math.round((discountPerUnit.doubleValue() / mrp.doubleValue()) * 100);
                        if (discountPercent > 0) {
                            discountStr = discountPercent + "% OFF";
                        }
                    }

                    String savingsStr = lineSavings.compareTo(BigDecimal.ZERO) > 0 ? "Rs." + String.format("%.2f", lineSavings) : "Rs.0.00";
                    String hsnCode = (item.getHsnCode() != null && !item.getHsnCode().isBlank()) ? item.getHsnCode() : "1006";

                    PdfPCell c1 = new PdfPCell(new Phrase(String.valueOf(index++), tableCellFont));
                    c1.setPadding(4);
                    c1.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemTable.addCell(c1);

                    PdfPCell c2 = new PdfPCell(new Phrase(item.getProductName() + (item.getVariantName() != null && !item.getVariantName().isBlank() ? " (" + item.getVariantName() + ")" : ""), tableCellFont));
                    c2.setPadding(4);
                    itemTable.addCell(c2);

                    PdfPCell c3 = new PdfPCell(new Phrase(hsnCode, tableCellFont));
                    c3.setPadding(4);
                    c3.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemTable.addCell(c3);

                    PdfPCell c4 = new PdfPCell(new Phrase(String.valueOf(qty), tableCellFont));
                    c4.setPadding(4);
                    c4.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemTable.addCell(c4);

                    PdfPCell c5 = new PdfPCell(new Phrase("Rs." + String.format("%.2f", mrp), tableCellFont));
                    c5.setPadding(4);
                    c5.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c5);

                    PdfPCell c6 = new PdfPCell(new Phrase("Rs." + String.format("%.2f", unitPrice), tableCellFont));
                    c6.setPadding(4);
                    c6.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c6);

                    PdfPCell c7 = new PdfPCell(new Phrase(discountStr, discountStr.contains("%") ? tableSavingsFont : tableCellFont));
                    c7.setPadding(4);
                    c7.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemTable.addCell(c7);

                    PdfPCell c8 = new PdfPCell(new Phrase(savingsStr, lineSavings.compareTo(BigDecimal.ZERO) > 0 ? tableSavingsFont : tableCellFont));
                    c8.setPadding(4);
                    c8.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c8);

                    PdfPCell c9 = new PdfPCell(new Phrase("Rs." + String.format("%.2f", lineTotal), tableCellBold));
                    c9.setPadding(4);
                    c9.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c9);
                }
            }

            document.add(itemTable);
            document.add(new Paragraph(" "));

            // 4. Order Confirmation Summary (All-Inclusive, Zero Breakup, Zero Separate Shipping/Tax/Roundoff)
            PdfPTable middleSection = new PdfPTable(2);
            middleSection.setWidthPercentage(100);
            middleSection.setWidths(new float[]{1.1f, 1f});

            BigDecimal finalTotal = order.getTotalAmount() != null ? order.getTotalAmount() : (order.getSubtotal() != null ? order.getSubtotal() : BigDecimal.ZERO);

            // Left Cell: Delivery Confirmation Box
            PdfPCell deliveryBoxCell = new PdfPCell();
            deliveryBoxCell.setPadding(10);
            deliveryBoxCell.setBorderColor(emeraldDark);
            deliveryBoxCell.setBorderWidth(1.2f);
            
            Paragraph pConfirmTitle = new Paragraph("Delivery Confirmation Note:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, emeraldDark));
            Paragraph pConfirmText = new Paragraph("All prices listed are all-inclusive of product, doorstep delivery, and applicable taxes across India.\nNo additional charges payable upon delivery.", fontRegular);
            pConfirmText.setSpacingBefore(4f);

            deliveryBoxCell.addElement(pConfirmTitle);
            deliveryBoxCell.addElement(pConfirmText);
            middleSection.addCell(deliveryBoxCell);

            // Right Cell: Clean Totals Summary Table
            PdfPCell summaryCellWrapper = new PdfPCell();
            summaryCellWrapper.setBorder(Rectangle.NO_BORDER);

            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{1.4f, 1.6f});

            summaryTable.addCell(createSummaryLabelCell("Total Quantity:", fontRegular));
            summaryTable.addCell(createSummaryValueCell(totalQty + " Units", fontRegular));

            summaryTable.addCell(createSummaryLabelCell("Pricing Model:", fontRegular));
            summaryTable.addCell(createSummaryValueCell("All-Inclusive", fontRegular));

            if (totalOrderSavings.compareTo(BigDecimal.ZERO) > 0) {
                summaryTable.addCell(createSummaryLabelCell("Your Total Savings:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(4, 120, 87))));
                summaryTable.addCell(createSummaryValueCell("Rs." + String.format("%.2f", totalOrderSavings), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(4, 120, 87))));
            }

            if (order.getShippingFee() != null && order.getShippingFee().compareTo(BigDecimal.ZERO) > 0) {
                summaryTable.addCell(createSummaryLabelCell("Shipping Fee:", fontRegular));
                summaryTable.addCell(createSummaryValueCell("Rs." + String.format("%.2f", order.getShippingFee()), fontRegular));
            }

            PdfPCell totalLblCell = createSummaryLabelCell("Total Amount:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, emeraldDark));
            totalLblCell.setBackgroundColor(emeraldBg);
            summaryTable.addCell(totalLblCell);

            PdfPCell totalValCell = createSummaryValueCell("Rs." + String.format("%.2f", finalTotal), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, emeraldDark));
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
                    "* Transport & Transit damages are not responsible by Seller. (Transit issues)\n" +
                    "* Goods Once Sold, Cannot be Returned or Refunded.\n" +
                    "* If Quality issue proved by Suitable evidence via Supporting Email Conversation, Valid Returns or Refunds Are Applied according to Refund policy.",
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

            // Embed Signature Image — resized to 150x55px at 50% quality to keep file size tiny
            try {
                String[] possibleSigPaths = {
                    "/var/www/myclients-fullstacts/vinnavar-fullstack/vinnavar-backend/media/site/signature.png",
                    "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/signature.png"
                };
                java.io.File sigFile = null;
                for (String sp : possibleSigPaths) {
                    java.io.File sf = new java.io.File(sp);
                    if (sf.exists()) {
                        sigFile = sf;
                        break;
                    }
                }
                if (sigFile != null) {
                    byte[] sigBytes = resizeImageToJpeg(sigFile, 150, 55, 0.50f);
                    if (sigBytes != null) {
                        Image sigImage = Image.getInstance(sigBytes);
                        sigImage.scaleToFit(100f, 45f);
                        sigImage.setAlignment(Element.ALIGN_RIGHT);
                        footRight.addElement(sigImage);
                    }
                }
            } catch (Exception sigEx) {
                // Signature image fallback
            }

            Paragraph pSig = new Paragraph("(Authorized Signatory)", fontSmall);
            pSig.setAlignment(Element.ALIGN_RIGHT);
            footRight.addElement(pSig);
            footerTable.addCell(footRight);

            document.add(footerTable);

            Paragraph thankYouLine = new Paragraph("Thank you for choosing Vinnavar Organics! Visit Again!", FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 10, emeraldDark));
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
