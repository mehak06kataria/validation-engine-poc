package com.mehak.validationengine;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mehak.validationengine.model.UserProfile;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SaveProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldSaveValidProfile() throws Exception {
        UserProfile profile = new UserProfile();
        profile.setFirstName("Jane");
        profile.setLastName("Doe");
        profile.setEmail("jane.doe@example.com");
        profile.setPhone("9876543210");
        profile.setAge(25);
        profile.setEducation("B.Tech");
        profile.setExperience("2 years");
        profile.setResumePath("resume.pdf");

        mockMvc.perform(post("/api/profile/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profile)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectInvalidProfileDueToEmail() throws Exception {
        UserProfile profile = new UserProfile();
        profile.setFirstName("Jane");
        profile.setLastName("Doe");
        profile.setEmail("invalid-email"); // ❌ Invalid
        profile.setPhone("9876543210");
        profile.setAge(25);
        profile.setEducation("B.Tech");
        profile.setExperience("2 years");
        profile.setResumePath("resume.pdf");

        mockMvc.perform(post("/api/profile/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profile)))
                .andExpect(status().isBadRequest()); // Expecting 400 Bad Request
    }

}
