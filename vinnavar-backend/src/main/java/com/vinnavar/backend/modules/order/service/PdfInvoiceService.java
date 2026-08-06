package com.vinnavar.backend.modules.order.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.vinnavar.backend.modules.order.entity.Order;
import com.vinnavar.backend.modules.order.entity.OrderItem;
import com.vinnavar.backend.modules.order.entity.ShippingAddress;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfInvoiceService {

    public ByteArrayInputStream generateOrderInvoicePdf(Order order) {
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.DARK_GRAY);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(4, 120, 87)); // Emerald
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(4, 120, 87));
            Font fontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font fontRegular = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font fontSmall = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY);

            // Header Section Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{3f, 2f});

            // Company Info
            PdfPCell cellLeft = new PdfPCell();
            cellLeft.setBorder(Rectangle.NO_BORDER);
            cellLeft.addElement(new Paragraph("VINNAVAR ORGANICS", headerFont));
            cellLeft.addElement(new Paragraph("100% Pure & Certified Organic Produce", subHeaderFont));
            cellLeft.addElement(new Paragraph("Tamil Nadu, India • Contact: support@vinnavar.com", fontSmall));
            headerTable.addCell(cellLeft);

            // Invoice Title & Info
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
            LineSeparator ls = new LineSeparator(1f, 100f, new Color(4, 120, 87), Element.ALIGN_CENTER, -2);
            document.add(new Chunk(ls));
            document.add(new Paragraph(" "));

            // Customer & Address Info Table
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{1f, 1f});

            // Shipping Address
            ShippingAddress ship = order.getShippingAddress();
            PdfPCell shipCell = new PdfPCell();
            shipCell.setPadding(8);
            shipCell.setBackgroundColor(new Color(245, 247, 250));
            shipCell.setBorderColor(new Color(220, 225, 230));
            shipCell.addElement(new Paragraph("SHIPPING ADDRESS", fontBold));
            shipCell.addElement(new Paragraph(order.getCustomerName(), fontRegular));
            shipCell.addElement(new Paragraph("Phone: " + order.getCustomerPhone() + " | Email: " + (order.getCustomerEmail() != null ? order.getCustomerEmail() : "N/A"), fontRegular));
            if (ship != null) {
                shipCell.addElement(new Paragraph(ship.getStreetAddress() + ", " + ship.getCity() + ", " + ship.getState() + " - " + ship.getPincode(), fontRegular));
            }
            if (order.getGstin() != null && !order.getGstin().isBlank()) {
                shipCell.addElement(new Paragraph("GSTIN: " + order.getGstin(), fontBold));
            }
            infoTable.addCell(shipCell);

            // Billing Address
            ShippingAddress bill = order.getBillingAddress();
            PdfPCell billCell = new PdfPCell();
            billCell.setPadding(8);
            billCell.setBackgroundColor(new Color(245, 247, 250));
            billCell.setBorderColor(new Color(220, 225, 230));
            billCell.addElement(new Paragraph("BILLING ADDRESS", fontBold));
            if (bill != null) {
                billCell.addElement(new Paragraph(bill.getFullName() != null ? bill.getFullName() : order.getCustomerName(), fontRegular));
                billCell.addElement(new Paragraph(bill.getStreetAddress() + ", " + bill.getCity() + ", " + bill.getState() + " - " + bill.getPincode(), fontRegular));
            } else {
                billCell.addElement(new Paragraph("Same as Shipping Address", fontRegular));
            }
            infoTable.addCell(billCell);

            document.add(infoTable);
            document.add(new Paragraph(" "));

            // Items Table
            PdfPTable itemTable = new PdfPTable(5);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new float[]{0.6f, 3.5f, 1f, 1.2f, 1.5f});

            // Table Headers
            String[] headers = {"#", "Product Description", "Qty", "Unit Price", "Total (₹)"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell();
                cell.setBackgroundColor(new Color(4, 120, 87));
                cell.setPadding(6);
                cell.setHorizontalAlignment(header.contains("Total") || header.contains("Price") ? Element.ALIGN_RIGHT : Element.ALIGN_LEFT);
                cell.setPhrase(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE)));
                itemTable.addCell(cell);
            }

            int index = 1;
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    PdfPCell c1 = new PdfPCell(new Phrase(String.valueOf(index++), fontRegular));
                    c1.setPadding(5);
                    itemTable.addCell(c1);

                    PdfPCell c2 = new PdfPCell(new Phrase(item.getProductName() + " (" + item.getVariantName() + ")", fontRegular));
                    c2.setPadding(5);
                    itemTable.addCell(c2);

                    PdfPCell c3 = new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), fontRegular));
                    c3.setPadding(5);
                    c3.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemTable.addCell(c3);

                    PdfPCell c4 = new PdfPCell(new Phrase("₹" + (item.getUnitPrice() != null ? item.getUnitPrice().toString() : "0"), fontRegular));
                    c4.setPadding(5);
                    c4.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c4);

                    PdfPCell c5 = new PdfPCell(new Phrase("₹" + (item.getTotalPrice() != null ? item.getTotalPrice().toString() : "0"), fontBold));
                    c5.setPadding(5);
                    c5.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemTable.addCell(c5);
                }
            }

            document.add(itemTable);
            document.add(new Paragraph(" "));

            // Price Breakdown Summary Box
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(45);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.setWidths(new float[]{2.5f, 1.8f});

            // Subtotal / Base Price
            summaryTable.addCell(createSummaryLabelCell("Base Price / Subtotal:", fontRegular));
            summaryTable.addCell(createSummaryValueCell("₹" + order.getSubtotal().toString(), fontRegular));

            // Weight Based Shipping
            summaryTable.addCell(createSummaryLabelCell("Weight Based Shipping:", fontRegular));
            summaryTable.addCell(createSummaryValueCell("₹" + order.getShippingFee().toString(), fontRegular));

            // GST Tax
            summaryTable.addCell(createSummaryLabelCell("GST Tax (5%):", fontRegular));
            summaryTable.addCell(createSummaryValueCell("₹" + order.getGstTax().toString(), fontRegular));

            // Grand Total
            PdfPCell totalLblCell = createSummaryLabelCell("Grand Total:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(4, 120, 87)));
            totalLblCell.setBackgroundColor(new Color(236, 253, 245));
            summaryTable.addCell(totalLblCell);

            PdfPCell totalValCell = createSummaryValueCell("₹" + order.getTotalAmount().toString(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(4, 120, 87)));
            totalValCell.setBackgroundColor(new Color(236, 253, 245));
            summaryTable.addCell(totalValCell);

            document.add(summaryTable);
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            // Footer Note
            Paragraph footer = new Paragraph("Thank you for choosing Vinnavar Organics! Healthy & Pure Always.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, new Color(4, 120, 87)));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

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
        cell.setPadding(5);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        return cell;
    }

    private PdfPCell createSummaryValueCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(new Color(230, 235, 240));
        cell.setPadding(5);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return cell;
    }
}
