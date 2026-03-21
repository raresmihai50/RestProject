package restproject;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import restproject.domain.User;
import restproject.repo.UserRepository;
import restproject.services.UserService;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // <- MAGIA: Curăță automat baza de date după FIECARE test!
public class UserTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testRegisterUser_Success() {
        User savedUser = userService.registerUser("testuser", "test@test.com", "parola123");
        
        assertNotNull(savedUser.getId(), "User-ul ar trebui să aibă un ID generat");
        assertEquals("testuser", savedUser.getUsername());
        assertTrue(passwordEncoder.matches("parola123", savedUser.getPassword()), "Parola trebuie să fie criptată corect");
    }

    @Test
    void testRegisterUser_DuplicateEmailThrowsError() {
        userService.registerUser("user1", "comun@test.com", "parola123");
        
        // Verificăm că dacă încercăm să băgăm alt user cu același email, dă eroare
        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser("user2", "comun@test.com", "altaparola");
        });
        
        assertTrue(exception.getMessage().contains("deja folosit"));
    }

    @Test
    void testLoginUser_SuccessAndFail() {
        userService.registerUser("loginuser", "login@test.com", "parola123");
        
        // 1. Succes (nu ar trebui să arunce excepție)
        assertDoesNotThrow(() -> userService.loginUser("login@test.com", "parola123"));
        
        // 2. Eșec parolă greșită
        assertThrows(RuntimeException.class, () -> userService.loginUser("login@test.com", "parolagresita"));
        
        // 3. Eșec email inexistent
        assertThrows(RuntimeException.class, () -> userService.loginUser("fantoma@test.com", "parola123"));
    }

    @Test
    void testUpdateUser_Success() {
        userService.registerUser("updateuser", "up@test.com", "veche");
        
        userService.updateUser("up@test.com", "veche", "numeNou", "noua");
        
        User updated = userRepository.findByEmail("up@test.com").get();
        assertEquals("numeNou", updated.getUsername());
        assertTrue(passwordEncoder.matches("noua", updated.getPassword()));
    }
}