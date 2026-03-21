package restproject.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CarRequest {
    @NotBlank(message = "Email-ul proprietarului este obligatoriu!")
    @Email(message = "Email invalid.")
    private String email;

    @NotBlank(message = "Marca mașinii nu poate fi goală!")
    private String brand;

    @NotBlank(message = "Modelul mașinii nu poate fi gol!")
    private String model;

    @NotNull(message = "Anul de fabricație este obligatoriu!")
    @Min(value = 1886, message = "Anul trebuie să fie mai mare de 1886.")
    @Max(value = 2025, message = "Anul nu poate depăși anul curent.")
    private Integer fabricationYear;

    @NotNull(message = "Capacitatea cilindrică este obligatorie!")
    @Min(value = 0, message = "Capacitatea nu poate fi negativă.")
    private Double engineCapacity;

    @NotNull(message = "Puterea mașinii este obligatorie!")
    @Min(value = 1, message = "Mașina trebuie să aibă măcar 1 cal putere.")
    private Integer horsepower;

    // Getteri
    public String getEmail() { return email; }
    public String getBrand() { return brand; }
    public String getModel() { return model; }
    public Integer getFabricationYear() { return fabricationYear; }
    public Double getEngineCapacity() { return engineCapacity; }
    public Integer getHorsepower() { return horsepower; }

    // Setteri
    public void setEmail(String email) { this.email = email; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setModel(String model) { this.model = model; }
    public void setFabricationYear(Integer fabricationYear) { this.fabricationYear = fabricationYear; }
    public void setEngineCapacity(Double engineCapacity) { this.engineCapacity = engineCapacity; }
    public void setHorsepower(Integer horsepower) { this.horsepower = horsepower; }
}