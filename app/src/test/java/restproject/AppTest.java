package restproject;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.springframework.security.crypto.password.PasswordEncoder;

import restproject.domain.User;
import restproject.repo.UserRepository;
import restproject.services.UserService;

import java.util.Optional;

class UserServiceTest {

    @Test
    void testRegisterUser_Success() {
        // 1. "Mockuim" (simulăm) dependințele. Nu vrem să salvăm real în baza de date în timpul testului.
        UserRepository mockRepo = mock(UserRepository.class);
        PasswordEncoder mockEncoder = mock(PasswordEncoder.class);

        // 2. Creăm instanța de UserService cu aceste mock-uri
        UserService userService = new UserService(mockRepo, mockEncoder);

        // 3. Definim comportamentul pe care îl așteptăm de la mock-uri
        // Spunem că username-ul și email-ul NU există deja în baza de date
        when(mockRepo.findByUsername("rares")).thenReturn(Optional.empty());
        when(mockRepo.findByEmail("rares@email.com")).thenReturn(Optional.empty());
        
        // Simulam ce face PasswordEncoder
        when(mockEncoder.encode("parolaMea123")).thenReturn("parola_criptata_123");
        
        // Când se apelează save(), returnăm direct obiectul trimis
        when(mockRepo.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // 4. Apelăm metoda TA de creare a user-ului
        User savedUser = userService.registerUser("rares", "rares@email.com", "parolaMea123");

        // 5. Verificăm rezultatele (Assertions)
        assertNotNull(savedUser, "User-ul creat nu ar trebui să fie null");
        assertEquals("rares", savedUser.getUsername(), "Username-ul nu corespunde");
        assertEquals("rares@email.com", savedUser.getEmail(), "Email-ul nu corespunde");
        
        // Verificăm dacă parola salvată este cea criptată, NU cea în clar!
        assertEquals("parola_criptata_123", savedUser.getPassword(), "Parola nu a fost criptată corect");
    }
}