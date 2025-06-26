package com.mehak.validationengine.service;

import org.mvel2.MVEL;
import org.mvel2.ParserContext;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.Map;

@Service
public class ValidationService {

    public boolean evaluate(String rule, Map<String, Object> data) {
        try {
            ParserContext context = new ParserContext();
            context.setStrongTyping(false); // Skip type enforcement

            Serializable compiled = MVEL.compileExpression(rule, context);
            Object result = MVEL.executeExpression(compiled, data);

            return result instanceof Boolean && (Boolean) result;
        } catch (Exception e) {
            System.err.println("Validation error: " + e.getMessage());
            return false;
        }
    }
}
