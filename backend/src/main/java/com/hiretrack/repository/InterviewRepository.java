package com.hiretrack.repository;

import com.hiretrack.entity.Interview;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
  List<Interview> findAllByApplicationUserIdOrderByInterviewDateAsc(Long userId);

  long countByApplicationUserId(Long userId);
}
