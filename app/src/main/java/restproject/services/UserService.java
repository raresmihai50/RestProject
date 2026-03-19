package restproject.services;

import org.springframework.security.crypto.password.PasswordEncoder;

import restproject.domain.User;
import restproject.repo.UserRepository;

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
}
