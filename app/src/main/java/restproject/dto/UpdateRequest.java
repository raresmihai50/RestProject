package restproject.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateRequest {
    
    @NotBlank(message = "Email-ul este obligatoriu pentru identificare!")
    @Email(message = "Format email invalid.")
    private String email;

    @NotBlank(message = "Trebuie să introduci parola curentă pentru a face modificări!")
    private String currentPassword;

    @Size(min = 1, max = 128, message = "Numele nou trebuie să aibă între 1 și 128 de caractere.")
    private String newUsername;

    @Size(min = 4, message = "Parola nouă trebuie să aibă minim 4 caractere pentru securitate.")
    private String newPassword;

    // --- Getters ---
    public String getEmail() { return email; }
    public String getCurrentPassword() { return currentPassword; }
    public String getNewUsername() { return newUsername; }
    public String getNewPassword() { return newPassword; }

    // --- Setters ---
    public void setEmail(String email) { this.email = email; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
    public void setNewUsername(String newUsername) { this.newUsername = newUsername; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}