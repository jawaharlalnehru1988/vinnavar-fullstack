package com.vinnavar.backend.modules.order.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.vinnavar.backend.modules.order.entity.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class EmailService {

    @Value("${app.email.sendgrid-api-key}")
    private String sendGridApiKey;

    @Value("${app.email.from-email}")
    private String fromEmailStr;

    @Value("${app.email.admin-email}")
    private String adminEmailStr;

    public void sendOrderConfirmation(Order order) {
        if (sendGridApiKey == null || sendGridApiKey.isBlank() || 
            fromEmailStr == null || fromEmailStr.isBlank()) {
            log.warn("SendGrid configuration is missing. Cannot send email.");
            return;
        }

        CompletableFuture.runAsync(() -> {
            // 1. Send Email to Customer
            if (order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank()) {
                sendEmail(
                    order.getCustomerEmail(),
                    "Order Confirmation - " + order.getOrderNumber(),
                    buildCustomerEmailContent(order)
                );
            } else {
                log.info("No customer email provided for order: {}", order.getOrderNumber());
            }

            // 2. Send Email to Admin
            if (adminEmailStr != null && !adminEmailStr.isBlank()) {
                sendEmail(
                    adminEmailStr,
                    "New Order Received: " + order.getOrderNumber(),
                    buildAdminEmailContent(order)
                );
            }
        }).exceptionally(ex -> {
            log.error("Failed to execute async email sending: ", ex);
            return null;
        });
    }

    private void sendEmail(String toEmailStr, String subject, String bodyContent) {
        Email from = new Email(fromEmailStr, "Vinnavar Organics");
        Email to = new Email(toEmailStr);
        Content content = new Content("text/html", bodyContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            log.info("Email sent to {}. Status Code: {}", toEmailStr, response.getStatusCode());
        } catch (IOException ex) {
            log.error("Failed to send email to {}: {}", toEmailStr, ex.getMessage());
        }
    }

    private String buildCustomerEmailContent(Order order) {
        return "<h3>Thank you for your order!</h3>" +
               "<p>Hi " + order.getCustomerName() + ",</p>" +
               "<p>Your order <strong>" + order.getOrderNumber() + "</strong> has been successfully placed.</p>" +
               "<p><strong>Total Amount:</strong> Rs. " + order.getTotalAmount() + "</p>" +
               "<p><strong>Payment Method:</strong> " + order.getPaymentMethod() + "</p>" +
               "<p>We will notify you once it ships. Thank you for shopping with Vinnavar Organics!</p>";
    }

    private String buildAdminEmailContent(Order order) {
        return "<h3>New Order Received</h3>" +
               "<p>A new order has been placed on the store.</p>" +
               "<ul>" +
               "<li><strong>Order Number:</strong> " + order.getOrderNumber() + "</li>" +
               "<li><strong>Customer Name:</strong> " + order.getCustomerName() + "</li>" +
               "<li><strong>Customer Phone:</strong> " + order.getCustomerPhone() + "</li>" +
               "<li><strong>Total Amount:</strong> Rs. " + order.getTotalAmount() + "</li>" +
               "<li><strong>Payment Method:</strong> " + order.getPaymentMethod() + "</li>" +
               "</ul>" +
               "<p>Please check the admin dashboard for full details.</p>";
    }
}
