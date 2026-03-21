package restproject;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import restproject.domain.Car;
import restproject.domain.User;
import restproject.dto.CarRequest;
import restproject.repo.CarRepository;
import restproject.repo.UserRepository;
import restproject.services.CarService;
import restproject.services.UserService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Ne asigurăm că lăsăm garajul și userii intacți la final
public class CarTest {

    @Autowired
    private CarService carService;

    @Autowired
    private UserService userService;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    // O funcție utilitară internă pentru a crea ușor un request de mașină în teste
    private CarRequest createCarRequest(String email, String brand, String model) {
        CarRequest req = new CarRequest();
        // Presupunând că ai creat settere în clasa CarRequest. Dacă nu, te rog să le adaugi!
        req.setEmail(email);
        req.setBrand(brand);
        req.setModel(model);
        req.setFabricationYear(2020);
        req.setEngineCapacity(2000.0);
        req.setHorsepower(150);
        return req;
    }

    @Test
    void testAddAndGetCars() {
        // 1. Creăm un user
        userService.registerUser("carowner", "car@test.com", "pass");

        // 2. Îi adăugăm 2 mașini
        carService.addCar(createCarRequest("car@test.com", "BMW", "Seria 3"));
        carService.addCar(createCarRequest("car@test.com", "Audi", "A4"));

        // 3. Verificăm dacă le putem citi pe amândouă
        List<Car> myCars = carService.getUserCars("car@test.com");
        assertEquals(2, myCars.size(), "Userul ar trebui să aibă exact 2 mașini");
        assertTrue(myCars.stream().anyMatch(c -> c.getBrand().equals("BMW")));
    }

    @Test
    void testUpdateCar_SecurityCheck() {
        userService.registerUser("user1", "u1@test.com", "pass");
        userService.registerUser("user2", "u2@test.com", "pass");

        Car myCar = carService.addCar(createCarRequest("u1@test.com", "Dacia", "Logan"));

        carService.updateCar(myCar.getId(), "u1@test.com", createCarRequest("u1@test.com", "Dacia", "Logan Updated"));

        // User2 încearcă să modifice mașina lui User1 (ar trebui să crape!)
        CarRequest hackerRequest = createCarRequest("u2@test.com", "Ferrari", "Enzo");
        
        Exception ex = assertThrows(RuntimeException.class, () -> {
            carService.updateCar(myCar.getId(), "u2@test.com", hackerRequest);
        });
        
        assertTrue(ex.getMessage().contains("Nu ai permisiunea"));
    }

    @Test
    void testCascadeDelete_UserToCars() {
        // ACESTA ESTE TESTUL CARE VERIFICĂ CASCADE DELETE-UL SI DELETE-UL!
        
        // 1. Creăm un user
        userService.registerUser("deleteMe", "delete@test.com", "pass");
        
        // 2. Îi adăugăm o mașină
        Car savedCar = carService.addCar(createCarRequest("delete@test.com", "Mercedes", "C Class"));
        Car toDeleteCar = carService.addCar(createCarRequest("delete@test.com", "Mercedes", "E Class"));
        assertTrue(carRepository.findById(toDeleteCar.getId()).isPresent(), "Mașina ar trebui să fie salvată în baza de date");
        try
            {carService.deleteCar(toDeleteCar.getId(), "fake@test.com");
        }catch(Exception e){
                    assertTrue(e.getMessage().contains("Nu ai permisiunea să ștergi această mașină!"), "Ar trebui să primim o eroare de permisiune când încercăm să ștergem cu email greșit");
        } // Ar trebui să dea eroare pentru că emailul nu e al proprietarului
        // Verificăm că nu s-a șters mașina și că am primit eroarea de permisiune, acelasi test ca cel de mai sus dar scris altfel
        Exception ex = assertThrows(RuntimeException.class, () -> {
            carService.deleteCar(toDeleteCar.getId(), "fake@test.com");
        });
        assertTrue(ex.getMessage().contains("Nu ai permisiunea să ștergi această mașină!"), "Ar trebui să primim o eroare de permisiune când încercăm să ștergem cu email greșit");
        assertTrue(carRepository.findById(toDeleteCar.getId()).isPresent(), "Mașina ar trebui să fie salvată inca în baza de date");
        carService.deleteCar(toDeleteCar.getId(), "delete@test.com");
        assertFalse(carRepository.findById(toDeleteCar.getId()).isPresent(), "Mașina ar trebui să fie ștearsă după deleteCar");
        
        // Verificăm că mașina chiar a fost salvată în baza de date
        assertTrue(carRepository.findById(savedCar.getId()).isPresent());
        
        // 3. ȘTERGEM USERUL
        userService.deleteUser("delete@test.com", "pass");
        
        // 4. VERIFICĂM MAGIA LUI CASCADE TYPE ALL: Mașina ar fi trebuit să dispară automat!
        assertFalse(carRepository.findById(savedCar.getId()).isPresent(), 
            "Mașina ar fi trebuit să fie ștearsă automat odată cu utilizatorul!");
            
        assertTrue(carRepository.findByUserEmail("delete@test.com").isEmpty());
    }
}