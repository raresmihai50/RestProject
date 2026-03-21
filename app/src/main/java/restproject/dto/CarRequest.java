package restproject.dto;

public class CarRequest {
    private String email; // Ca să știm în garajul cui punem mașina
    private String brand;
    private String model;
    private Integer fabricationYear;
    private Double engineCapacity;
    private Integer horsepower;

    // Getteri
    public String getEmail() { return email; }
    public String getBrand() { return brand; }
    public String getModel() { return model; }
    public Integer getFabricationYear() { return fabricationYear; }
    public Double getEngineCapacity() { return engineCapacity; }
    public Integer getHorsepower() { return horsepower; }
}