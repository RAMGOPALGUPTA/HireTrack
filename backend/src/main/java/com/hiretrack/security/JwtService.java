package com.hiretrack.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class JwtService {
  @Value("${app.jwt.secret:}")
  private String secret;

  @Value("${app.jwt.expiration-ms}")
  private long expiration;

  private SecretKey key() {
    if (!StringUtils.hasText(secret) || secret.length() < 32) {
      throw new IllegalStateException("JWT_SECRET must be configured with at least 32 characters.");
    }
    return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String generate(String email) {
    Date now = new Date();
    return Jwts.builder()
        .subject(email)
        .issuedAt(now)
        .expiration(new Date(now.getTime() + expiration))
        .signWith(key())
        .compact();
  }

  public String email(String token) {
    return Jwts.parser()
        .verifyWith(key())
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();
  }
}