package org.example.repository;

import org.example.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String userEmail);

    @Query("SELECT b FROM Booking b WHERE b.hotel.managerEmail = :managerEmail")
    List<Booking> findByManagerEmail(String managerEmail);

    @Query("SELECT COUNT(b) FROM Booking b")
    long countAllBookings();

    @Query("SELECT SUM(b.total) FROM Booking b WHERE b.status = 'PAID'")
    Double sumTotalRevenue();
}