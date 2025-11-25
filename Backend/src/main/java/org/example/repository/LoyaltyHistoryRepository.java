package org.example.repository;

import org.example.entity.Loyalty;
import org.example.entity.LoyaltyHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoyaltyHistoryRepository extends JpaRepository<LoyaltyHistory, Long> {


    List<LoyaltyHistory> findByLoyaltyOrderByDateDesc(Loyalty loyalty);


    @Query("SELECT lh FROM LoyaltyHistory lh JOIN lh.loyalty l WHERE l.userEmail = :userEmail ORDER BY lh.date DESC")
    List<LoyaltyHistory> findByUserEmailOrderByDateDesc(@Param("userEmail") String userEmail);

}