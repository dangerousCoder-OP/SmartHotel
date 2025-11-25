package org.example.service;

import org.example.dto.Response.HotelDetailResponse;
import org.example.dto.Response.HotelSummaryResponse;
import org.example.entity.Hotel;
import org.example.enums.RoomType;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    public List<HotelSummaryResponse> searchHotels(String location, String roomType) {
        final RoomType parsedRoomType = parseRoomType(roomType);

        List<Hotel> hotels = hotelRepository.searchHotels(location, parsedRoomType);

        return hotels.stream()
                .filter(hotel -> hotel.getStatus() == org.example.enums.HotelStatus.APPROVED) // Only return approved hotels
                .map(hotel -> new HotelSummaryResponse(hotel, parsedRoomType))
                .collect(Collectors.toList());
    }

    private RoomType parseRoomType(String roomTypeString) {
        if (roomTypeString != null && !roomTypeString.isEmpty()) {
            try {
                return RoomType.valueOf(roomTypeString.toUpperCase());
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }

    public HotelDetailResponse getHotelDetail(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        return new HotelDetailResponse(hotel);
    }
}