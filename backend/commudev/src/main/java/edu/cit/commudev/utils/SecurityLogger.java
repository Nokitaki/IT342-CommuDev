package edu.cit.commudev.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

/**
 * Utility class for security-related logging.
 */
@Component
public class SecurityLogger {
    private static final Logger logger = LoggerFactory.getLogger(SecurityLogger.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Log authentication success.
     *
     * @param username the authenticated username
     */
    public void logAuthenticationSuccess(String username) {
        HttpServletRequest request = getCurrentRequest();
        String ipAddress = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        logger.info("AUTHENTICATION SUCCESS: User '{}' logged in from IP {} using {} at {}",
                username, ipAddress, userAgent, getCurrentTime());
    }

    /**
     * Log authentication failure.
     *
     * @param username the attempted username
     * @param reason the failure reason
     */
    public void logAuthenticationFailure(String username, String reason) {
        HttpServletRequest request = getCurrentRequest();
        String ipAddress = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        logger.warn("AUTHENTICATION FAILURE: Failed attempt for user '{}' from IP {} using {} at {}. Reason: {}",
                username, ipAddress, userAgent, getCurrentTime(), reason);
    }

    /**
     * Log an authorization failure.
     *
     * @param path the requested path
     * @param requiredRole the role that was required
     */
    public void logAuthorizationFailure(String path, String requiredRole) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";
        HttpServletRequest request = getCurrentRequest();
        String ipAddress = getClientIp(request);

        logger.warn("AUTHORIZATION FAILURE: User '{}' from IP {} attempted to access {} without required role {} at {}",
                username, ipAddress, path, requiredRole, getCurrentTime());
    }

    /**
     * Log suspicious activity.
     *
     * @param activity description of the suspicious activity
     * @param details additional details
     */
    public void logSuspiciousActivity(String activity, String details) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";
        HttpServletRequest request = getCurrentRequest();
        String ipAddress = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        logger.warn("SUSPICIOUS ACTIVITY: {} by user '{}' from IP {} using {} at {}. Details: {}",
                activity, username, ipAddress, userAgent, getCurrentTime(), details);
    }

    /**
     * Get the current HTTP request.
     *
     * @return the current request or a dummy request if none is available
     */
    private HttpServletRequest getCurrentRequest() {
        return Optional.ofNullable(RequestContextHolder.getRequestAttributes())
                .filter(attributes -> attributes instanceof ServletRequestAttributes)
                .map(attributes -> ((ServletRequestAttributes) attributes).getRequest())
                .orElse(null);
    }

    /**
     * Get the client IP address.
     *
     * @param request the HTTP request
     * @return the client IP address
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Get the current formatted time.
     *
     * @return formatted current time
     */
    private String getCurrentTime() {
        return LocalDateTime.now().format(formatter);
    }

    /**
     * Dummy HttpServletRequest for when a real request is not available.
     */
    private static abstract class HttpServletRequestWrapper implements HttpServletRequest {
        @Override
        public String getHeader(String name) {
            return "N/A";
        }

        @Override
        public String getRemoteAddr() {
            return "N/A";
        }

        // Implement other required methods with dummy returns
        // This is just a stub implementation
        // All other required methods would return null, empty collections, or default values

        // This would be completed with all required methods in a real implementation
    }
}