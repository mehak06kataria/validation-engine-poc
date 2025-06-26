package com.mehak.validationengine.controller;

import com.mehak.validationengine.model.ValidationRequest;
import com.mehak.validationengine.model.ValidationResponse;
import com.mehak.validationengine.model.ValidationResult;
import com.mehak.validationengine.service.ValidationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "*")
public class ValidationController {

    @Autowired
    private ValidationService validationService;

    @PostMapping(value = "/validate", consumes = {"multipart/form-data"})
    public ValidationResponse validate(
        @Valid @ModelAttribute ValidationRequest request,
        BindingResult bindingResult
    ) {
        boolean overallValid = true;

        // Collect annotation-based validation errors
        List<ValidationResult> results = bindingResult.getFieldErrors().stream()
            .map(error -> new ValidationResult(error.getDefaultMessage(), false))
            .toList();

        if (!results.isEmpty()) {
            overallValid = false;
        }

        // Use ValidationService for deeper validation and resume parsing
        List<ValidationResult> serviceResults = validationService.validateUserProfile(
            request.getFirstName(),
            request.getLastName(),
            request.getEmail(),
            request.getPhone(),
            request.getAge() != null ? request.getAge() : -1,
            request.getResume()
        );

        // Merge results and determine final validity
        results = new java.util.ArrayList<>(results);
        results.addAll(serviceResults);
        if (serviceResults.stream().anyMatch(r -> !r.isValid())) {
            overallValid = false;
        }

        return new ValidationResponse(
            overallValid,
            overallValid ? "All validations passed ✅" : "Some validations failed ❌",
            results
        );
    }
}
