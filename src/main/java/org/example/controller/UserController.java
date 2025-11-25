package org.example.controller;

import org.example.dto.Request.BookingRequest;
import org.example.dto.Response.BookingResponse;
import org.example.dto.Response.LoyaltyResponse;
import org.example.dto.Response.LoyaltyHistoryResponse;
import org.example.dto.Response.PaymentResponse;
import org.example.dto.Response.ReviewResponse;
import org.example.entity.Loyalty;
import org.example.exceptions.DuplicatePaymentException;
import org.example.exceptions.ResourceNotFoundException;
import org.example.service.BookingService;
import org.example.service.LoyaltyService;
import org.example.service.PaymentService;
import org.example.service.ReviewService;
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
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173"})
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private LoyaltyService loyaltyService;

    @PostMapping("/bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request,
                                           Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            BookingResponse booking = bookingService.createBooking(request, userEmail);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            logger.error("Error creating booking: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create booking: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserBookings(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<BookingResponse> bookings = bookingService.getUserBookings(userEmail);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error getting user bookings: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get user bookings: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/payments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> paymentData,
                                           Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            PaymentResponse payment = paymentService.createPayment(paymentData, userEmail);
            return ResponseEntity.ok(payment);
        } catch (DuplicatePaymentException e) {
            logger.error("Duplicate payment attempt: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid payment data: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            logger.error("Error creating payment: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to process payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/payments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserPayments(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<PaymentResponse> payments = paymentService.getUserPayments(userEmail);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            logger.error("Error getting user payments: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get user payments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> reviewData,
                                       Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ReviewResponse review = reviewService.addReview(reviewData, userEmail);
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid review data: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RuntimeException e) {
            logger.error("Review creation error: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Error adding review: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to add review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserReviews(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<ReviewResponse> reviews = reviewService.getUserReviews(userEmail);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            logger.error("Error getting user reviews: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get user reviews: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/loyalty")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getLoyalty(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            LoyaltyResponse loyalty = loyaltyService.getUserLoyaltyResponse(userEmail);
            return ResponseEntity.ok(loyalty);
        } catch (Exception e) {
            logger.error("Error getting loyalty: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get loyalty information: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/loyalty/redeem")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> redeemLoyalty(@RequestBody Map<String, Object> redeemData,
                                           Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Integer points = (Integer) redeemData.get("points");
            LoyaltyResponse loyalty = loyaltyService.redeemPointsResponse(userEmail, points);
            return ResponseEntity.ok(loyalty);
        } catch (Exception e) {
            logger.error("Error redeeming loyalty points: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to redeem loyalty points: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/loyalty/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getLoyaltyHistory(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<LoyaltyHistoryResponse> history = loyaltyService.getLoyaltyHistory(userEmail);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            logger.error("Error getting loyalty history: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get loyalty history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}