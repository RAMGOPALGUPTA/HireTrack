package com.hiretrack.controller;

import com.hiretrack.entity.Task;
import com.hiretrack.repository.TaskRepository;
import com.hiretrack.service.CurrentUser;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
  private final TaskRepository repo;
  private final CurrentUser current;

  public TaskController(TaskRepository r, CurrentUser c) {
    repo = r;
    current = c;
  }

  public record Request(String title, String description, LocalDateTime dueDate) {}

  private Map<String, Object> dto(Task t) {
    return Map.of(
        "id",
        t.getId(),
        "title",
        t.getTitle(),
        "description",
        t.getDescription() == null ? "" : t.getDescription(),
        "dueDate",
        t.getDueDate() == null ? "" : t.getDueDate(),
        "completed",
        t.isCompleted());
  }

  @GetMapping
  public List<Map<String, Object>> all() {
    return repo.findAllByUserIdOrderByDueDateAsc(current.get().getId()).stream()
        .map(this::dto)
        .toList();
  }

  @PostMapping
  public Map<String, Object> create(@RequestBody Request r) {
    Task t = new Task();
    t.setUser(current.get());
    t.setTitle(r.title());
    t.setDescription(r.description());
    t.setDueDate(r.dueDate());
    return dto(repo.save(t));
  }

  @PatchMapping("/{id}/complete")
  public Map<String, Object> complete(@PathVariable Long id) {
    Task t =
        repo.findByIdAndUserId(id, current.get().getId())
            .orElseThrow(() -> new NoSuchElementException("Task not found"));
    t.setCompleted(!t.isCompleted());
    return dto(repo.save(t));
  }
}
