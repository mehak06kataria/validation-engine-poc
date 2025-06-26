package com.example.validationengine.model;

import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

public class ValidationRequest {

    @NotBlank(message = "First name is required")
    @Pattern(regexp = "^[A-Za-z][A-Za-z\\s'-]{1,49}$", message = "Invalid first name")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Pattern(regexp = "^[A-Za-z][A-Za-z\\s'-]{1,49}$", message = "Invalid last name")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String phone;

    @NotNull(message = "Age is required")
    @Min(value = 19, message = "Age must be greater than 18")
    private Integer age;

    @NotNull(message = "Resume file is required")
    private MultipartFile resume;

    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public MultipartFile getResume() { return resume; }
    public void setResume(MultipartFile resume) { this.resume = resume; }
}
