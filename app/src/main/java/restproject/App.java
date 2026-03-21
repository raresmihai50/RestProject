// package restproject;
// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication
// public class App {

//     public static void main(String[] args) {
//         // Aici pornim efectiv serverul Spring Boot
//         SpringApplication.run(App.class, args);
//         System.out.println("Serverul a pornit cu succes! Baza de date este sincronizata.");
//     }
// }

package restproject;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import restproject.services.UserService;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    // Această metodă va rula AUTOMAT imediat ce serverul a pornit
    @Bean
    public CommandLineRunner testFlow(UserService userService) {
        return args -> {
            System.out.println("--- Testare înregistrare utilizator ---");
            
            try {
                // Încercăm să creăm un user de test
                userService.registerUser("r", "r@r.r", "1221");
                System.out.println("Utilizatorul a fost creat cu succes!");
            } catch (Exception e) {
                System.out.println("Eroare la test: " + e.getMessage());
            }

            System.out.println("Verifica acum tabelul 'users' in baza de date!");
        };
    }
}
