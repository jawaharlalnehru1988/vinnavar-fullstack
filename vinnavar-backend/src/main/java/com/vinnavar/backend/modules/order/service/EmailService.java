package com.vinnavar.backend.modules.order.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.vinnavar.backend.modules.order.entity.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class EmailService {

    private final PdfInvoiceService pdfInvoiceService;

    public EmailService(PdfInvoiceService pdfInvoiceService) {
        this.pdfInvoiceService = pdfInvoiceService;
    }

    @Value("${app.email.sendgrid-api-key}")
    private String sendGridApiKey;

    @Value("${app.email.from-email}")
    private String fromEmailStr;

    @Value("${app.email.admin-email}")
    private String adminEmailStr;

    public void sendOrderConfirmation(Order order) {
        if (order == null) {
            log.warn("Cannot send confirmation: Order is null.");
            return;
        }

        if (sendGridApiKey == null || sendGridApiKey.isBlank() || 
            fromEmailStr == null || fromEmailStr.isBlank()) {
            log.warn("SendGrid configuration is missing. Cannot send order confirmation email for order {}", order.getOrderNumber());
            return;
        }

        log.info("Queuing async order confirmation email for order: {} (Payment: {}, Customer: {}, Email: {})",
                order.getOrderNumber(), order.getPaymentMethod(), order.getCustomerName(), order.getCustomerEmail());

        CompletableFuture.runAsync(() -> {
            // Generate PDF Invoice as byte array
            byte[] pdfBytes = null;
            try {
                ByteArrayInputStream pdfStream = pdfInvoiceService.generateOrderInvoicePdf(order);
                if (pdfStream != null) {
                    pdfBytes = pdfStream.readAllBytes();
                    log.info("Generated PDF invoice for order {} ({} bytes)", order.getOrderNumber(), pdfBytes.length);
                }
            } catch (Exception e) {
                log.error("Failed to generate PDF Invoice for order {}: {}", order.getOrderNumber(), e.getMessage(), e);
            }

            // 1. Send Email to Customer
            String customerEmail = order.getCustomerEmail();
            if (customerEmail != null && !customerEmail.isBlank() && !customerEmail.equalsIgnoreCase("customer@vinnavar.com")) {
                log.info("Sending customer confirmation email for order {} to {}", order.getOrderNumber(), customerEmail);
                sendEmail(
                    customerEmail,
                    "Order Confirmation - " + order.getOrderNumber(),
                    buildCustomerEmailContent(order),
                    pdfBytes,
                    "Invoice_" + order.getOrderNumber().replace("/", "_") + ".pdf"
                );
            } else {
                log.info("No valid custom email for customer on order: {} (email value: {})", order.getOrderNumber(), customerEmail);
            }

            // 2. Send Email to Admin
            if (adminEmailStr != null && !adminEmailStr.isBlank()) {
                log.info("Sending admin notification email for order {} to {}", order.getOrderNumber(), adminEmailStr);
                sendEmail(
                    adminEmailStr,
                    "New Order Received: " + order.getOrderNumber() + " [" + order.getPaymentMethod() + "]",
                    buildAdminEmailContent(order),
                    pdfBytes,
                    "Invoice_" + order.getOrderNumber().replace("/", "_") + ".pdf"
                );
            } else {
                log.warn("No admin email configured for order notification.");
            }
        }).exceptionally(ex -> {
            log.error("Failed to execute async email sending for order {}: ", order.getOrderNumber(), ex);
            return null;
        });
    }

    private void sendEmail(String toEmailStr, String subject, String bodyContent, byte[] pdfBytes, String attachmentName) {
        Email from = new Email(fromEmailStr, "Vinnavar Organics");
        Email to = new Email(toEmailStr);
        Content content = new Content("text/html", bodyContent);
        Mail mail = new Mail(from, subject, to, content);

        if (pdfBytes != null && pdfBytes.length > 0) {
            try {
                String base64Content = Base64.getEncoder().encodeToString(pdfBytes);
                Attachments attachments = new Attachments();
                attachments.setContent(base64Content);
                attachments.setType("application/pdf");
                attachments.setFilename(attachmentName);
                attachments.setDisposition("attachment");
                attachments.setContentId("Invoice");
                mail.addAttachments(attachments);
            } catch (Exception e) {
                log.error("Failed to add PDF attachment to email for {}: {}", toEmailStr, e.getMessage());
            }
        }

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            log.info("Email sent to {}. Status Code: {}", toEmailStr, response.getStatusCode());
        } catch (IOException ex) {
            log.error("Failed to send email to {}: {}", toEmailStr, ex.getMessage(), ex);
        }
    }

    private String buildCustomerEmailContent(Order order) {
        return "<h3>Thank you for your order!</h3>" +
               "<p>Hi " + (order.getCustomerName() != null ? order.getCustomerName() : "Valued Customer") + ",</p>" +
               "<p>Your order <strong>" + order.getOrderNumber() + "</strong> has been successfully placed.</p>" +
               "<p><strong>Total Amount:</strong> Rs. " + order.getTotalAmount() + "</p>" +
               "<p><strong>Payment Method:</strong> " + order.getPaymentMethod() + "</p>" +
               "<p><strong>Payment Status:</strong> " + (order.getPaymentStatus() != null ? order.getPaymentStatus() : "PAID") + "</p>" +
               "<p>Your official tax invoice is attached with this email.</p>" +
               "<p>We will notify you once it ships. Thank you for shopping with Vinnavar Organics!</p>";
    }

    private String buildAdminEmailContent(Order order) {
        return "<h3>New Order Received</h3>" +
               "<p>A new order has been placed on the store.</p>" +
               "<ul>" +
               "<li><strong>Order Number:</strong> " + order.getOrderNumber() + "</li>" +
               "<li><strong>Customer Name:</strong> " + (order.getCustomerName() != null ? order.getCustomerName() : "N/A") + "</li>" +
               "<li><strong>Customer Phone:</strong> " + (order.getCustomerPhone() != null ? order.getCustomerPhone() : "N/A") + "</li>" +
               "<li><strong>Customer Email:</strong> " + (order.getCustomerEmail() != null ? order.getCustomerEmail() : "N/A") + "</li>" +
               "<li><strong>Total Amount:</strong> Rs. " + order.getTotalAmount() + "</li>" +
               "<li><strong>Payment Method:</strong> " + order.getPaymentMethod() + "</li>" +
               "<li><strong>Payment Status:</strong> " + (order.getPaymentStatus() != null ? order.getPaymentStatus() : "CONFIRMED") + "</li>" +
               "</ul>" +
               "<p>Please check the admin dashboard for full details. Invoice is attached.</p>";
    }
}
