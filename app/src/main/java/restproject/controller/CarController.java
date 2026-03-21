package restproject.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restproject.dto.CarRequest;
import restproject.services.CarService;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCar(@Valid @RequestBody CarRequest request) {
        try {
            carService.addCar(request);
            return ResponseEntity.ok(Map.of("message", "Mașina a fost adăugată în garaj!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-cars")
    public ResponseEntity<?> getMyCars(@RequestParam String email) {
        try {
            return ResponseEntity.ok(carService.getUserCars(email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @RequestBody CarRequest request) {
        try {
            carService.updateCar(id, request.getEmail(), request);
            return ResponseEntity.ok(Map.of("message", "Detaliile mașinii au fost actualizate!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable Long id, @RequestParam String email) {
        try {
            carService.deleteCar(id, email);
            return ResponseEntity.ok(Map.of("message", "Mașina a fost ștearsă din garaj!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}