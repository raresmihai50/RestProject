package restproject.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import restproject.domain.User;
import restproject.repo.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // --- ÎNREGISTRAREA ---
    public User registerUser(String username, String email, String rawPassword) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Eroare: Acest username este deja folosit!");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Eroare: Acest email este deja folosit!");
        }

        // Criptăm parola
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Creăm userul
        User newUser = new User(username, email, encodedPassword);
        User savedUser = userRepository.save(newUser);

        System.out.println("User înregistrat cu succes: " + username);
        return savedUser;
    }

    // --- AUTENTIFICAREA ---
    public void loginUser(String email, String rawPassword) {
        // 1. Căutăm userul după email
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Eroare: Nu există niciun cont cu acest email."));

        // 2. Verificăm dacă parola introdusă se potrivește cu cea criptată din baza de date
        boolean passwordMatches = passwordEncoder.matches(rawPassword, user.getPassword());
        
        if (!passwordMatches) {
            throw new RuntimeException("Eroare: Parola este incorectă!");
        }

        // Dacă ajungem aici, logarea este ok! Nu trebuie să returnăm nimic special
        System.out.println("User logat cu succes: " + email);
    }

    // --- PRELUARE DATE UTILIZATOR (PENTRU DASHBOARD) ---
    public User getUserDetails(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Eroare: Utilizatorul nu a fost găsit!"));
    }

    // --- ACTUALIZARE PROFIL ---
    public void updateUser(String email, String currentPassword, String newUsername, String newPassword) {
        // 1. Găsim userul
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Eroare: Utilizatorul nu a fost găsit!"));

        // 2. Verificăm dacă parola curentă introdusă este corectă (ca măsură de securitate)
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Eroare: Parola curentă este incorectă!");
        }

        // 3. Dacă a introdus un username nou, îl actualizăm
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            // Verificăm mai întâi să nu fie luat deja de altcineva
            if (!newUsername.equals(user.getUsername()) && userRepository.findByUsername(newUsername).isPresent()) {
                throw new RuntimeException("Eroare: Acest username este deja folosit!");
            }
            user.setUsername(newUsername);
        }

        // 4. Dacă a introdus o parolă nouă, o criptăm și o salvăm
        if (newPassword != null && !newPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        // 5. Salvăm modificările în baza de date
        userRepository.save(user);
        System.out.println("Profil actualizat cu succes pentru: " + email);
    }
}
