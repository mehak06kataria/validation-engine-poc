package com.example.validationengine.model;

import java.util.List;
import java.util.Map;

public class ValidationRequest {
    private Map<String, Object> data;
    private List<String> rules; // CHANGED from single rule to list

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public List<String> getRules() {
        return rules;
    }

    public void setRules(List<String> rules) {
        this.rules = rules;
    }
}
