package restproject.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import restproject.domain.User;
import restproject.dto.UpdateRequest;
import restproject.services.UserService;

@RestController
@RequestMapping("/api/users") // <-- Ruta de bază schimbată
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // --- DATELE UTILIZATORULUI (PENTRU DASHBOARD) ---
    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestParam String email) {
        try {
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
    // @PostMapping("/update") // (Alternativ, aici se poate folosi @PutMapping)
    // public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateRequest request) {
    //     try {
    //         userService.updateUser(
    //             request.getEmail(), 
    //             request.getCurrentPassword(), 
    //             request.getNewUsername(), 
    //             request.getNewPassword()
    //         );
    //         return ResponseEntity.ok(Map.of("message", "Profil actualizat cu succes!"));
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    //     }
    //}

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateRequest request) {
        userService.updateUser(
            request.getEmail(), 
            request.getCurrentPassword(), 
            request.getNewUsername(), 
            request.getNewPassword()
        );
        
        return ResponseEntity.ok(Map.of("message", "Profil actualizat cu succes!"));
    }

    // --- ȘTERGERE CONT ---
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String password = payload.get("password");
            
            userService.deleteUser(email, password);
            return ResponseEntity.ok(Map.of("message", "Contul a fost șters cu succes!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}