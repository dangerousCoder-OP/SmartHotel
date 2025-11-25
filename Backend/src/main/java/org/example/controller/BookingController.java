package org.example.controller;

import org.example.dto.Request.BookingRequest;
import org.example.dto.Response.BookingResponse;
import org.example.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173"})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        BookingResponse booking = bookingService.createBooking(request, userEmail);
        return ResponseEntity.ok(booking);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getUserBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        List<BookingResponse> bookings = bookingService.getUserBookings(userEmail);
        return ResponseEntity.ok(bookings);
    }
}