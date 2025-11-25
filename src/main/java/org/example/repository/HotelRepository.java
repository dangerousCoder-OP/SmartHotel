package org.example.repository;

import org.example.entity.Hotel;
import org.example.enums.HotelStatus;
import org.example.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByManagerEmail(String managerEmail);
    List<Hotel> findByStatus(HotelStatus status);
    List<Hotel> findByLocationContainingIgnoreCaseAndStatus(String location, HotelStatus status);

    @Query("SELECT h FROM Hotel h LEFT JOIN h.rooms r WHERE " +
            "(:location IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:roomType IS NULL OR r.type = :roomType) AND " +
            "h.status = 'APPROVED'")
    List<Hotel> searchHotels(@Param("location") String location, @Param("roomType") RoomType roomType);
}