package org.example.controller;

import org.example.dto.Response.HotelDetailResponse;
import org.example.dto.Response.HotelSummaryResponse;
import org.example.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = {"http://localhost:5173"})
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<HotelSummaryResponse>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String roomType) {

        List<HotelSummaryResponse> hotels = hotelService.searchHotels(location, roomType);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDetailResponse> getHotel(@PathVariable Long id) {
        HotelDetailResponse hotel = hotelService.getHotelDetail(id);
        return ResponseEntity.ok(hotel);
    }
}