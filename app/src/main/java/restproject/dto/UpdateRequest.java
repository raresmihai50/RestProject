package restproject.dto;

public class UpdateRequest {
    
    private String email;
    private String currentPassword;
    private String newUsername;
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