package restproject.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import restproject.domain.Car;
import restproject.domain.User;
import restproject.repo.CarRepository;
import restproject.repo.UserRepository;
import restproject.dto.CarRequest;

import java.util.List;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CarService(CarRepository carRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    // CREATE (Adaugă o mașină)
    public Car addCar(CarRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit!"));

        Car car = new Car(
            request.getBrand(), 
            request.getModel(), 
            request.getFabricationYear(), 
            request.getEngineCapacity(), 
            request.getHorsepower()
        );
        car.setUser(user);
        user.getCars().add(car);
        return carRepository.save(car);
    }

    // READ (Ia toate mașinile unui user)
    public List<Car> getUserCars(String email) {
        return carRepository.findByUserEmail(email);
    }

    // UPDATE (Actualizează o mașină existentă)
    public Car updateCar(Long carId, String email, CarRequest request) {
        Car car = carRepository.findById(carId)
            //.orElseThrow(() -> new RuntimeException("Mașina nu a fost găsită!"));
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mașina nu a fost găsită!"));

        // Verificare de securitate: Doar proprietarul poate modifica mașina
        if (!car.getUser().getEmail().equals(email)) {
            //throw new RuntimeException("Nu ai permisiunea să modifici această mașină!");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nu ai permisiunea să modifici această mașină!");
        }

        car.setBrand(request.getBrand());
        car.setModel(request.getModel());
        car.setFabricationYear(request.getFabricationYear());
        car.setEngineCapacity(request.getEngineCapacity());
        car.setHorsepower(request.getHorsepower());

        return carRepository.save(car);
    }

    // DELETE (Șterge o mașină)
    public void deleteCar(Long carId, String email) {
        Car car = carRepository.findById(carId)
            //.orElseThrow(() -> new RuntimeException("Mașina nu a fost găsită!"));
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mașina nu a fost găsită!"));

        // Verificare de securitate
        if (!car.getUser().getEmail().equals(email)) {
            //throw new RuntimeException("Nu ai permisiunea să ștergi această mașină!");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nu ai permisiunea să ștergi această mașină!");
        }

        User user = car.getUser();
        user.getCars().remove(car);

        carRepository.delete(car);
    }
}