package restproject.config;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Erorile de validare (pe care le-am făcut anterior)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }

    // 2. Erorile de logică cu HTTP Status specific (404, 403, 401, 409 etc.)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        // ex.getStatusCode() va returna automat 404, 403 etc., în funcție de ce setăm noi în Service
        // ex.getReason() este mesajul de eroare propriu-zis
        //return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getReason())); //varianta 1
        return ResponseEntity
            .status(ex.getStatusCode())
            .body(Map.of("error", ex.getReason() != null ? ex.getReason() : "Eroare neprevăzută")); //varianta 2 (în caz că nu setăm un mesaj de eroare, să avem totuși un răspuns decent)

    }
}