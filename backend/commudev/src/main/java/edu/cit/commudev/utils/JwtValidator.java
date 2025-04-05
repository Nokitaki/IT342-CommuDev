package edu.cit.commudev.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

/**
 * Utility class to decode and inspect a JWT token
 */
public class JwtValidator {
    public static void main(String[] args) {
        // Replace this with your actual token
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJLZW5qaSIsImlhdCI6MTc0MzUxNjg5MiwiZXhwIjoxNzQzNjAzMjkyfQ.pxY2HRp5Yy2IslVaPDNgbHIGcIqM7TrXGoiAuLmEVUk";

        // Replace this with your actual secret key from application.properties
        String secretKey = "RM0bx8csdC4HbqAkG9fk1oeJZ9G4p9GVshZtSpDcwlk";

        try {
            // Parse the token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSignInKey(secretKey))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Print the claims
            System.out.println("Token Subject (Username/Email): " + claims.getSubject());
            System.out.println("Token Issuer: " + claims.getIssuer());
            System.out.println("Token Expiration: " + claims.getExpiration());
            System.out.println("Token Issued At: " + claims.getIssuedAt());
            System.out.println("Is Token Expired: " + claims.getExpiration().before(new Date()));

            // Print all claims
            System.out.println("\nAll Claims:");
            claims.forEach((key, value) -> System.out.println(key + ": " + value));

        } catch (Exception e) {
            System.out.println("Error parsing token: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static Key getSignInKey(String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}