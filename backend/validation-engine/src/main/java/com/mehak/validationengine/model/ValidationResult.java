package com.mehak.validationengine.model;

public class ValidationResult {
    private String rule;
    private boolean valid;
    private String message; // NEW

    // Constructor for success/failure without a message
    public ValidationResult(String rule, boolean valid) {
        this.rule = rule;
        this.valid = valid;
    }

    // Constructor for failure with message
    public ValidationResult(String rule, boolean valid, String message) {
        this.rule = rule;
        this.valid = valid;
        this.message = message;
    }

    public String getRule() {
        return rule;
    }

    public void setRule(String rule) {
        this.rule = rule;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() { // NEW
        return message;
    }

    public void setMessage(String message) { // NEW
        this.message = message;
    }
}
