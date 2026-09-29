package com.ruffcol.tienda.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JWTAuthenticationFilter jwtAuthenticationFilter;
    
    @Value("${cors.allowed.origins}")
    private String[] allowedOrigins;
    
    @Value("${cors.allowed.methods}")
    private String[] allowedMethods;
    
    @Value("${cors.allowed.headers}")
    private String[] allowedHeaders;
    
    @Value("${cors.allow.credentials}")
    private boolean allowCredentials;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable())) // Permitir iframes para H2 console
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sin estado
            .authorizeHttpRequests(auth -> auth
                // Recursos estáticos y frontend
                .requestMatchers("/", "/*.html", "/css/**", "/js/**", "/images/**", "/uploads/**").permitAll()
                // Endpoints de autenticación
                .requestMatchers("/api/auth/**").permitAll()
                // Endpoints públicos de API (lectura)
                .requestMatchers("/api/categorias").permitAll()
                .requestMatchers("/api/categorias/{id}").permitAll()
                .requestMatchers("/api/productos").permitAll()
                .requestMatchers("/api/productos/{id}").permitAll()
                .requestMatchers("/api/productos/categoria/{idCategoria}").permitAll()
                // Endpoints protegidos por roles
                .requestMatchers("/api/categorias/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/productos/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/superadmin/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/pedidos").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/pedidos/**").authenticated()
                // Documentación OpenAPI/Swagger
                .requestMatchers("/swagger-ui/**", "/api-docs/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                // H2 Console
                .requestMatchers("/h2-console/**").permitAll()
                // Error page
                .requestMatchers("/error").permitAll()
                // Cualquier otra solicitud requiere autenticación
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        configuration.setAllowedHeaders(Arrays.asList(allowedHeaders));
        configuration.setAllowCredentials(allowCredentials);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
