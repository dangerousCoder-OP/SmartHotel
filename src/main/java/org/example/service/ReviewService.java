package org.example.service;

import org.example.dto.Response.ReviewResponse;
import org.example.entity.Booking;
import org.example.entity.Hotel;
import org.example.entity.Review;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.HotelRepository;
import org.example.repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private LoyaltyService loyaltyService;

    @Transactional
    public ReviewResponse addReview(Map<String, Object> reviewData, String userEmail) {
        try {
            logger.info("Adding review for user: {}, data: {}", userEmail, reviewData);

            // Validate required fields
            if (!reviewData.containsKey("bookingId") || !reviewData.containsKey("hotelId")
                    || !reviewData.containsKey("rating") || !reviewData.containsKey("comment")) {
                throw new IllegalArgumentException("Missing required review fields: bookingId, hotelId, rating, and comment are required");
            }

            Long bookingId = Long.valueOf(reviewData.get("bookingId").toString());
            Long hotelId = Long.valueOf(reviewData.get("hotelId").toString());
            Integer rating = Integer.valueOf(reviewData.get("rating").toString());
            String comment = (String) reviewData.get("comment");

            if (rating < 1 || rating > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5");
            }

            if (comment == null || comment.trim().isEmpty()) {
                throw new IllegalArgumentException("Comment cannot be empty");
            }

            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

            Hotel hotel = hotelRepository.findById(hotelId)
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

            if (!booking.getUserEmail().equals(userEmail)) {
                throw new RuntimeException("Unauthorized to review this booking");
            }

            // Check if review already exists for this booking
            if (reviewRepository.existsByBookingId(bookingId)) {
                throw new RuntimeException("Review already exists for this booking");
            }

            Review review = Review.builder()
                    .booking(booking)
                    .hotel(hotel)
                    .userEmail(userEmail)
                    .rating(rating)
                    .comment(comment.trim())
                    .build();

            Review savedReview = reviewRepository.save(review);

            // Award 50 loyalty points for review
            loyaltyService.awardPoints(userEmail, 50, "Hotel review for " + hotel.getName());

            // Update hotel rating
            updateHotelRating(hotel);

            logger.info("Review created successfully: {}", savedReview.getId());
            return new ReviewResponse(savedReview);

        } catch (Exception e) {
            logger.error("Error adding review for user {}: {}", userEmail, e.getMessage(), e);
            throw e;
        }
    }

    public List<ReviewResponse> getUserReviews(String userEmail) {
        List<Review> reviews = reviewRepository.findByUserEmail(userEmail);
        return reviews.stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getHotelReviews(Long hotelId) {
        List<Review> reviews = reviewRepository.findByHotelId(hotelId);
        return reviews.stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }



    private void updateHotelRating(Hotel hotel) {
        List<Review> reviews = reviewRepository.findByHotelId(hotel.getId());
        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            hotel.setRating(Math.round(avgRating * 10.0) / 10.0); // Round to 1 decimal
            hotelRepository.save(hotel);
            logger.info("Updated hotel {} rating to: {}", hotel.getName(), hotel.getRating());
        }
    }
}