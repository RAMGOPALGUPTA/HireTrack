package com.hiretrack.repository;

import com.hiretrack.entity.Task;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
  List<Task> findAllByUserIdOrderByDueDateAsc(Long userId);

  Optional<Task> findByIdAndUserId(Long id, Long userId);
}
