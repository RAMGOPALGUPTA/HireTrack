package com.hiretrack.controller;

import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(NoSuchElementException.class)
  ResponseEntity<?> missing(Exception e) {
    return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  ResponseEntity<?> bad(Exception e) {
    return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<?> other(Exception e) {
    return ResponseEntity.status(500).body(Map.of("message", "Unexpected server error"));
  }
}
