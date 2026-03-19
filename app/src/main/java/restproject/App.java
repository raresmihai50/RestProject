package restproject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        // Aici pornim efectiv serverul Spring Boot
        SpringApplication.run(App.class, args);
        System.out.println("Serverul a pornit cu succes! Baza de date este sincronizata.");
    }
}
