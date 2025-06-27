package com.mehak.validationengine.controller;

import com.mehak.validationengine.model.UserProfile;
import com.mehak.validationengine.repository.UserProfileRepository;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class SaveProfileController {

    @Autowired
    private UserProfileRepository repository;

    @PostMapping("/save")
    public ResponseEntity<?> saveProfile(@Valid @RequestBody UserProfile profile) {
        repository.save(profile);
        return ResponseEntity.ok(Map.of("results", List.of(
            Map.of("rule", "Profile saved successfully", "valid", true)
        )));
    }

    @GetMapping("/{id}")
    public UserProfile getProfile(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }
}
