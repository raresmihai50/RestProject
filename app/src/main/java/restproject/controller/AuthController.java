package restproject.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import restproject.dto.LoginRequest;
import restproject.dto.RegisterRequest; 
import restproject.services.UserService;

@RestController 
@RequestMapping("/api/auth") 
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // --- ÎNREGISTRARE ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            userService.registerUser(
                request.getUsername(),
                request.getEmail(), 
                request.getPassword()
            );
            return ResponseEntity.ok(Map.of("message", "Cont creat cu succes!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- AUTENTIFICARE ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            userService.loginUser(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(Map.of("message", "Autentificare cu succes!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    } 
}