package org.example.controller;

import org.example.dto.Response.ManagerBookingResponse;
import org.example.dto.Response.ManagerHotelResponse;
import org.example.dto.Response.ManagerReviewResponse;
import org.example.service.ManagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = {"http://localhost:5173"})
public class ManagerController {

    private static final Logger logger = LoggerFactory.getLogger(ManagerController.class);

    @Autowired
    private ManagerService managerService;

    @PostMapping("/hotels")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> addHotel(@RequestBody Map<String, Object> hotelData,
                                      Authentication authentication) {
        try {
            String managerEmail = authentication.getName();
            ManagerHotelResponse hotel = managerService.addHotel(hotelData, managerEmail);
            return ResponseEntity.ok(hotel);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid hotel data: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            logger.error("Error adding hotel: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to add hotel: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/hotels")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getManagerHotels(Authentication authentication) {
        try {
            String managerEmail = authentication.getName();
            List<ManagerHotelResponse> hotels = managerService.getManagerHotels(managerEmail);
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            logger.error("Error getting manager hotels: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get hotels: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getManagerBookings(Authentication authentication) {
        try {
            String managerEmail = authentication.getName();
            List<ManagerBookingResponse> bookings = managerService.getManagerBookings(managerEmail);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error getting manager bookings: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get bookings: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/reviews")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getManagerReviews(Authentication authentication) {
        try {
            String managerEmail = authentication.getName();
            List<ManagerReviewResponse> reviews = managerService.getManagerReviews(managerEmail);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            logger.error("Error getting manager reviews: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get reviews: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/reviews/{id}/reply")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> replyToReview(@PathVariable Long id,
                                           @RequestBody Map<String, String> replyData,
                                           Authentication authentication) {
        try {
            String managerEmail = authentication.getName();
            String replyText = replyData.get("reply");

            if (replyText == null || replyText.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Reply text is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            String result = managerService.replyToReview(id, managerEmail, replyText);
            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", result);
            return ResponseEntity.ok(successResponse);
        } catch (RuntimeException e) {
            logger.error("Unauthorized reply attempt: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (Exception e) {
            logger.error("Error replying to review: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to reply to review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}