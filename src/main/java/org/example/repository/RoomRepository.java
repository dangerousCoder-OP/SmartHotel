package org.example.repository;

import org.example.entity.Room;
import org.example.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);
    Optional<Room> findByHotelIdAndType(Long hotelId, RoomType type);
}