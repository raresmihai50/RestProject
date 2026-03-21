package restproject.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import restproject.domain.Car;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    
    // Spring Data JPA va genera automat interogarea SQL pentru această metodă.
    // Va căuta în tabelul "cars" toate mașinile unde "user.email" se potrivește cu parametrul dat.
    List<Car> findByUserEmail(String email);
    
}