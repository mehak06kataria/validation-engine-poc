package com.mehak.validationengine.controller;

import com.example.validationengine.model.ValidationRequest;
import com.mehak.validationengine.model.ValidationResponse;
import com.mehak.validationengine.model.ValidationResult;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ValidationController {

    @PostMapping(value = "/validate", consumes = {"multipart/form-data"})
    public ValidationResponse validate(
        @Valid @ModelAttribute ValidationRequest request,
        BindingResult bindingResult
    ) {
        List<ValidationResult> results = new ArrayList<>();

        // Add all field-level errors from validation annotations
        bindingResult.getFieldErrors().forEach(error ->
            results.add(new ValidationResult(error.getDefaultMessage(), false))
        );

        // Additional file type check
        MultipartFile resume = request.getResume();
        boolean validResume = resume != null &&
                Objects.requireNonNull(resume.getOriginalFilename()).toLowerCase().endsWith(".pdf");
        if (!validResume) {
            results.add(new ValidationResult("Resume must be a PDF file", false));
        }

        boolean overallValid = results.isEmpty();
        if (overallValid) {
            results.add(new ValidationResult("All fields are valid ✅", true));
        }

        return new ValidationResponse(overallValid, overallValid ? "All validations passed" : "Some validations failed", results);
    }
}
