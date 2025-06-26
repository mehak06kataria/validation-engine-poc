package com.mehak.validationengine.controller;

import com.example.validationengine.model.ValidationRequest;
import com.mehak.validationengine.model.ValidationResponse;
import com.mehak.validationengine.model.ValidationResult;
import com.mehak.validationengine.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow all frontend origins
public class ValidationController {

    @Autowired
    private ValidationService validationService;

    @PostMapping("/validate")
    public ValidationResponse validate(@RequestBody ValidationRequest request) {
        List<ValidationResult> results = new ArrayList<>();

        Map<String, Object> data = request.getData();
        List<String> rules = request.getRules();

        for (String rule : rules) {
            boolean isValid = false;
            String field = rule.split(" ")[0];
        
            if (rule.contains("isEmail")) {
                isValid = data.containsKey(field) &&
                          data.get(field).toString().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
        
            } else if (rule.contains("isValidName")) {
                isValid = data.containsKey(field) &&
                          data.get(field) != null &&
                          !data.get(field).toString().trim().isEmpty() &&
                          data.get(field).toString().trim().matches("^[A-Za-z][A-Za-z\\s'-]{1,49}$");
            }            
             else {
                isValid = validationService.evaluate(rule, data);
            }
        
            results.add(new ValidationResult(rule, isValid));
        }
        
        return new ValidationResponse(false, null, results);
    }
}
