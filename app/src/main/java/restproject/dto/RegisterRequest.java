package restproject.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    
    @NotBlank(message = "Numele de utilizator este obligatoriu!")
    @Size(min = 3, max = 50, message = "Numele trebuie să aibă între 3 și 50 de caractere.")
    private String username;

    @NotBlank(message = "Email-ul este obligatoriu!")
    @Email(message = "Te rugăm să introduci o adresă de email validă!")
    private String email;

    @NotBlank(message = "Parola este obligatorie!")
    @Size(min = 4, message = "Parola trebuie să aibă minim 4 caractere pentru securitate.")
    private String password;

    // --- Getters ---
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    // --- Setters ---
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}