package com.hiretrack.repository;

import com.hiretrack.entity.JobApplication;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<JobApplication, Long> {
  List<JobApplication> findAllByUserIdOrderByCreatedAtDesc(Long userId);

  Optional<JobApplication> findByIdAndUserId(Long id, Long userId);

  long countByUserId(Long userId);

  long countByUserIdAndStatus(Long userId, String status);
}
