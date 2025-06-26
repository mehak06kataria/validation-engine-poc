package com.mehak.validationengine.service;

import com.mehak.validationengine.model.ValidationResult;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ValidationService {

    private final ResumeParserService resumeParserService;

    public ValidationService(ResumeParserService resumeParserService) {
        this.resumeParserService = resumeParserService;
    }

    public List<ValidationResult> validateUserProfile(
        String firstName,
        String lastName,
        String email,
        String phone,
        int age,
        MultipartFile resume
    ) {
        List<ValidationResult> results = new ArrayList<>();

        // Basic validations
        results.add(new ValidationResult("First name is valid", isValidName(firstName)));
        results.add(new ValidationResult("Last name is valid", isValidName(lastName)));
        results.add(new ValidationResult("Email is valid", isValidEmail(email)));
        results.add(new ValidationResult("Phone number is valid", isValidPhone(phone)));
        results.add(new ValidationResult("Age is above 18", age > 18));

        // Resume parsing
        String parsedText = resumeParserService.parseResume(resume);
        boolean mentionsJava = parsedText.toLowerCase().contains("java");
        results.add(new ValidationResult("Resume mentions 'Java'", mentionsJava));

        return results;
    }

    // Validation helpers
    private boolean isValidName(String name) {
        return name != null && name.matches("^[a-zA-Z]+$");
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    private boolean isValidPhone(String phone) {
        return phone != null && phone.matches("^\\d{10}$");
    }
}
