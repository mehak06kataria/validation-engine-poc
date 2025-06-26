package com.mehak.validationengine.model;

import java.util.List;

public class ValidationResponse {
    private boolean valid;
    private String message;
    private List<ValidationResult> results;

    public ValidationResponse() {}

    public ValidationResponse(boolean valid, String message, List<ValidationResult> results) {
        this.valid = valid;
        this.message = message;
        this.results = results;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ValidationResult> getResults() {
        return results;
    }

    public void setResults(List<ValidationResult> results) {
        this.results = results;
    }
}
