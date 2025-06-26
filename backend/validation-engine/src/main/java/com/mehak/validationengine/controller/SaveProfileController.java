package com.mehak.validationengine.controller;

import com.mehak.validationengine.model.UserProfile;
import com.mehak.validationengine.repository.UserProfileRepository;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class SaveProfileController {

    @Autowired
    private UserProfileRepository repository;

   @PostMapping("/save")
public ResponseEntity<?> saveProfile(@Valid @RequestBody UserProfile profile, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
        List<Map<String, Object>> results = bindingResult.getFieldErrors().stream().map(error -> {
            Map<String, Object> map = new HashMap<>();
            map.put("rule", error.getField() + ": " + error.getDefaultMessage());
            map.put("valid", false);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.badRequest().body(Map.of("results", results));
    }

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
