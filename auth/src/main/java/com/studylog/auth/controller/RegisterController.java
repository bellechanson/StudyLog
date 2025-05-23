package com.studylog.auth.controller;

import com.studylog.auth.entity.User;
import com.studylog.auth.service.RegisterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    private final RegisterService registerService;

    public RegisterController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> result = registerService.registerUser(user);
        int status = Integer.parseInt(result.getOrDefault("status", "200"));
        return ResponseEntity.status(status).body(result);
    }

    @PostMapping("/register/request")
    public ResponseEntity<Map<String, String>> requestRegister(@RequestBody User user) {
        Map<String, String> result = registerService.requestRegister(user);
        int status = Integer.parseInt(result.getOrDefault("status", "200"));
        return ResponseEntity.status(status).body(result);
    }
}