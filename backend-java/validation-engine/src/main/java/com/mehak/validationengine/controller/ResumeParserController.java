package com.mehak.validationengine.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5179") // allow frontend access
public class ResumeParserController {

    @PostMapping("/parse-resume")
    public ResponseEntity<?> parseResume(@RequestParam("resume") MultipartFile file) {
        if (file.isEmpty() || !Objects.equals(file.getContentType(), "application/pdf")) {
            return ResponseEntity.badRequest().body("Invalid resume file.");
        }

        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            Map<String, String> parsedData = new HashMap<>();

            // Extract name (first non-empty line)
            String[] lines = text.split("\\r?\\n");
            for (String line : lines) {
                if (!line.trim().isEmpty()) {
                    parsedData.put("name", line.trim());
                    break;
                }
            }

            // Extract email
            Matcher emailMatcher = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}").matcher(text);
            if (emailMatcher.find()) {
                parsedData.put("email", emailMatcher.group());
            }

            // Extract phone number (basic 10-digit number)
            Matcher phoneMatcher = Pattern.compile("\\b\\d{10}\\b").matcher(text);
            if (phoneMatcher.find()) {
                parsedData.put("phone", phoneMatcher.group());
            }

            // Dummy fallback data
            parsedData.putIfAbsent("education", "B.Tech in Computer Science");
            parsedData.putIfAbsent("experience", "2 years at XYZ Corp");

            return ResponseEntity.ok(parsedData);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to parse resume: " + e.getMessage());
        }
    }
}
