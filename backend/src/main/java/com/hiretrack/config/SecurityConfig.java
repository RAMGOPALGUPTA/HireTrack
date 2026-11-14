package com.hiretrack.config;

import com.hiretrack.repository.UserRepository;
import com.hiretrack.security.JwtService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    UserDetailsService userDetailsService(UserRepository repo) {
        return email -> {
            var u = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
            return User.withUsername(u.getEmail()).password(u.getPassword()).roles("USER").build();
        };
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception {
        return c.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }

    @Bean
    SecurityFilterChain chain(HttpSecurity h, JwtService jwt, UserDetailsService uds) throws Exception {
        OncePerRequestFilter filter = new OncePerRequestFilter() {
            protected void doFilterInternal(HttpServletRequest q, HttpServletResponse r, FilterChain c)
                    throws ServletException, IOException {
                String a = q.getHeader("Authorization");
                if (a != null && a.startsWith("Bearer ")
                        && SecurityContextHolder.getContext().getAuthentication() == null) {
                    try {
                        String email = jwt.email(a.substring(7));
                        var d = uds.loadUserByUsername(email);
                        var auth = new UsernamePasswordAuthenticationToken(d, null, d.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    } catch (Exception ignored) {
                    }
                }
                c.doFilter(q, r);
            }
        };
        return h.csrf(x -> x.disable()).cors(x -> {
        }).sessionManagement(x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(x -> x.requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll().anyRequest().authenticated())
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class).build();
    }
}