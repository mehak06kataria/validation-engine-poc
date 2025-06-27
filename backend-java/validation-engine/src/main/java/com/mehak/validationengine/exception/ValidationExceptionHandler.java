package main.java.com.mehak.validationengine.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<Map<String, Object>> errors = ex.getBindingResult().getFieldErrors().stream().map(err -> {
            Map<String, Object> map = new HashMap<>();
            map.put("rule", err.getField() + ": " + err.getDefaultMessage());
            map.put("valid", false);
            return map;
        }).toList();

        return new ResponseEntity<>(Map.of("results", errors), HttpStatus.BAD_REQUEST);
    }
}
