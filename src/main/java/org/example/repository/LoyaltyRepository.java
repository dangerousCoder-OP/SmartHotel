package org.example.repository;

import org.example.entity.Loyalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoyaltyRepository extends JpaRepository<Loyalty, Long> {
    Optional<Loyalty> findByUserEmail(String userEmail);
}