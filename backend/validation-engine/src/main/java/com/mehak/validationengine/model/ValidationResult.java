package com.mehak.validationengine.model;

public class ValidationResult {
    private String rule;
    private boolean valid;

    public ValidationResult() {}

    public ValidationResult(String rule, boolean valid) {
        this.rule = rule;
        this.valid = valid;
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
}
