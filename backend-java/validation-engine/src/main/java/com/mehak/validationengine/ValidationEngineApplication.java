package com.mehak.validationengine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.mehak.validationengine")
@EnableJpaRepositories(basePackages = "com.mehak.validationengine.repository")
@EntityScan(basePackages = "com.mehak.validationengine.model")
public class ValidationEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(ValidationEngineApplication.class, args);
    }
}
