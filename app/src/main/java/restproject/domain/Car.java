package restproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cars")
public class Car extends BaseEntity {

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(name = "fabrication_year", nullable = false)
    private Integer fabricationYear;

    @Column(name = "engine_capacity", nullable = false)
    private Double engineCapacity;

    @Column(nullable = false)
    private Integer horsepower;

    // Relația cu User: Mai multe mașini aparțin unui singur utilizator
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // FOARTE IMPORTANT: Previne o buclă infinită la transformarea în JSON (User -> Car -> User -> Car...)
    private User user;

    // Constructori
    public Car() {}

    public Car(String brand, String model, Integer fabricationYear, Double engineCapacity, Integer horsepower) {
        this.brand = brand;
        this.model = model;
        this.fabricationYear = fabricationYear;
        this.engineCapacity = engineCapacity;
        this.horsepower = horsepower;
    }

    // Getteri și Setteri
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getFabricationYear() { return fabricationYear; }
    public void setFabricationYear(Integer fabricationYear) { this.fabricationYear = fabricationYear; }

    public Double getEngineCapacity() { return engineCapacity; }
    public void setEngineCapacity(Double engineCapacity) { this.engineCapacity = engineCapacity; }

    public Integer getHorsepower() { return horsepower; }
    public void setHorsepower(Integer horsepower) { this.horsepower = horsepower; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}