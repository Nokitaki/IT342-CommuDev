package edu.cit.commudev.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Service for sending emails.
 * Updated to work with the new UserEntity.
 */
@Service
public class EmailService {
    private final JavaMailSender emailSender;

    @Value("${spring.mail.username:noreply@example.com}")
    private String fromEmail;

    @Value("${app.name:My Application}")
    private String appName;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    /**
     * Send a verification email with a verification code.
     *
     * @param to recipient email
     * @param subject email subject
     * @param text email content
     * @throws MessagingException if email cannot be sent
     */
    public void sendVerificationEmail(String to, String subject, String text) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);

        // Create HTML email content
        String htmlContent = createVerificationEmailTemplate(text);

        helper.setText(htmlContent, true); // true indicates HTML content
        emailSender.send(message);
    }

    /**
     * Send a password reset email.
     *
     * @param to recipient email
     * @param resetToken reset token
     * @throws MessagingException if email cannot be sent
     */
    public void sendPasswordResetEmail(String to, String resetToken) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(appName + " - Password Reset");

        // Create reset link
        String resetLink = "https://yourapplication.com/reset-password?token=" + resetToken;

        // Create HTML email content
        String htmlContent = createPasswordResetTemplate(resetLink);

        helper.setText(htmlContent, true); // true indicates HTML content
        emailSender.send(message);
    }

    /**
     * Create a professional HTML template for verification emails.
     *
     * @param verificationText the verification text/code
     * @return HTML template as string
     */
    private String createVerificationEmailTemplate(String verificationText) {
        return "<html>"
                + "<body style=\"font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                + "<h1 style=\"color: #4a86e8;\">" + appName + "</h1>"
                + "</div>"
                + "<div style=\"padding: 20px; border-top: 1px solid #eee; border-bottom: 1px solid #eee;\">"
                + "<h2 style=\"color: #333;\">Verify Your Account</h2>"
                + "<p style=\"color: #666; line-height: 1.5;\">"
                + "Thank you for registering! To complete your registration and activate your account, please use the verification code below:"
                + "</p>"
                + "<div style=\"background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;\">"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #4a86e8; margin: 0;\">" + verificationText + "</p>"
                + "</div>"
                + "<p style=\"color: #666; line-height: 1.5;\">"
                + "If you did not request this verification, please ignore this email."
                + "</p>"
                + "</div>"
                + "<div style=\"margin-top: 20px; text-align: center; color: #999; font-size: 12px;\">"
                + "<p>&copy; " + java.time.Year.now().getValue() + " " + appName + ". All rights reserved.</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }

    /**
     * Create a professional HTML template for password reset emails.
     *
     * @param resetLink the password reset link
     * @return HTML template as string
     */
    private String createPasswordResetTemplate(String resetLink) {
        return "<html>"
                + "<body style=\"font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                + "<h1 style=\"color: #4a86e8;\">" + appName + "</h1>"
                + "</div>"
                + "<div style=\"padding: 20px; border-top: 1px solid #eee; border-bottom: 1px solid #eee;\">"
                + "<h2 style=\"color: #333;\">Reset Your Password</h2>"
                + "<p style=\"color: #666; line-height: 1.5;\">"
                + "We received a request to reset your password. Click the button below to create a new password:"
                + "</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<a href=\"" + resetLink + "\" style=\"background-color: #4a86e8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;\">Reset Password</a>"
                + "</div>"
                + "<p style=\"color: #666; line-height: 1.5;\">"
                + "If you did not request a password reset, please ignore this email or contact support if you have concerns."
                + "</p>"
                + "<p style=\"color: #666; line-height: 1.5;\">"
                + "This link will expire in 1 hour."
                + "</p>"
                + "</div>"
                + "<div style=\"margin-top: 20px; text-align: center; color: #999; font-size: 12px;\">"
                + "<p>&copy; " + java.time.Year.now().getValue() + " " + appName + ". All rights reserved.</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }
}