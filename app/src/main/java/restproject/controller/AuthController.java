package restproject.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import restproject.domain.User;
import restproject.dto.LoginRequest;
// Asigură-te că ai creat și clasele RegisterRequest și UpdateRequest în folderul dto
import restproject.dto.RegisterRequest; 
import restproject.dto.UpdateRequest;
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
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
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

    // --- AUTENTIFICARE (LOGIN SIMPLU) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Apelăm o metodă simplă din service care verifică doar email-ul și parola
            userService.loginUser(request.getEmail(), request.getPassword());
            
            // Dacă nu a dat eroare, logarea a reușit
            return ResponseEntity.ok(Map.of("message", "Autentificare cu succes!"));
        } catch (RuntimeException e) {
            // Parolă greșită sau email inexistent
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    } 

    // --- DATELE UTILIZATORULUI (PENTRU DASHBOARD) ---
    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestParam String email) {
        try {
            // Va trebui să ai o metodă getUserDetails în UserService
            User user = userService.getUserDetails(email);
            return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "email", user.getEmail()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- ACTUALIZARE PROFIL ---
    @PostMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateRequest request) {
        try {
            userService.updateUser(
                request.getEmail(), 
                request.getCurrentPassword(), 
                request.getNewUsername(), 
                request.getNewPassword()
            );
            return ResponseEntity.ok(Map.of("message", "Profil actualizat cu succes!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}