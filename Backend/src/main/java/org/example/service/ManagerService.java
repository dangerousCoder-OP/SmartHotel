package org.example.service;

import org.example.dto.Response.ManagerBookingResponse;
import org.example.dto.Response.ManagerHotelResponse;
import org.example.dto.Response.ManagerReviewResponse;
import org.example.entity.Booking;
import org.example.entity.Hotel;
import org.example.entity.Review;
import org.example.entity.Room;
import org.example.enums.RoomType;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.HotelRepository;
import org.example.repository.ReviewRepository;
import org.example.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ManagerService {

    private static final Logger logger = LoggerFactory.getLogger(ManagerService.class);

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    public ManagerHotelResponse addHotel(Map<String, Object> hotelData, String managerEmail) {
        try {
            logger.info("Adding hotel for manager: {}", managerEmail);

            // Extract hotel basic information
            String name = (String) hotelData.get("name");
            String location = (String) hotelData.get("location");
            String description = (String) hotelData.get("description");
            String imageUrl = (String) hotelData.get("imageUrl");

            // Validate required fields
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Hotel name is required");
            }
            if (location == null || location.trim().isEmpty()) {
                throw new IllegalArgumentException("Hotel location is required");
            }

            // Extract amenities
            @SuppressWarnings("unchecked")
            List<String> amenities = (List<String>) hotelData.get("amenities");
            if (amenities == null) {
                amenities = new ArrayList<>();
            }

            // Extract rooms data
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> roomsData = (List<Map<String, Object>>) hotelData.get("rooms");
            if (roomsData == null) {
                roomsData = new ArrayList<>();
            }

            // Create hotel with images
            List<String> images = new ArrayList<>();
            if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                images.add(imageUrl);
            }

            Hotel hotel = Hotel.builder()
                    .name(name.trim())
                    .location(location.trim())
                    .description(description != null ? description.trim() : "")
                    .images(images)
                    .amenities(amenities)
                    .managerEmail(managerEmail)
                    .status(org.example.enums.HotelStatus.PENDING)
                    .build();

            Hotel savedHotel = hotelRepository.save(hotel);

            // Create rooms based on the provided data
            for (Map<String, Object> roomData : roomsData) {
                String roomTypeStr = (String) roomData.get("type");
                Double price = ((Number) roomData.get("price")).doubleValue();
                Integer available = ((Number) roomData.get("available")).intValue();

                RoomType roomType;
                try {
                    roomType = RoomType.valueOf(roomTypeStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    roomType = RoomType.STANDARD;
                }

                Room room = Room.builder()
                        .hotel(savedHotel)
                        .type(roomType)
                        .price(price)
                        .available(available)
                        .build();

                roomRepository.save(room);
            }

            logger.info("Hotel created successfully: {}", savedHotel.getId());
            return new ManagerHotelResponse(savedHotel);

        } catch (Exception e) {
            logger.error("Error adding hotel for manager {}: {}", managerEmail, e.getMessage(), e);
            throw e;
        }
    }

    public List<ManagerHotelResponse> getManagerHotels(String managerEmail) {
        List<Hotel> hotels = hotelRepository.findByManagerEmail(managerEmail);
        return hotels.stream()
                .map(ManagerHotelResponse::new)
                .collect(Collectors.toList());
    }

    public List<ManagerBookingResponse> getManagerBookings(String managerEmail) {
        List<Booking> bookings = bookingRepository.findByManagerEmail(managerEmail);
        return bookings.stream()
                .map(ManagerBookingResponse::new)
                .collect(Collectors.toList());
    }

    public List<ManagerReviewResponse> getManagerReviews(String managerEmail) {
        List<Review> reviews = reviewRepository.findByManagerEmail(managerEmail);
        return reviews.stream()
                .map(ManagerReviewResponse::new)
                .collect(Collectors.toList());
    }
    @Transactional
    public String replyToReview(Long reviewId, String managerEmail, String replyText) {
        try {
            logger.info("Starting reply process for review: {}, manager: {}", reviewId, managerEmail);

            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

            logger.info("Found review: {}, Hotel: {}, Hotel Manager: {}",
                    reviewId, review.getHotel().getName(), review.getHotel().getManagerEmail());

            // Verify that the manager owns the hotel associated with this review
            if (!review.getHotel().getManagerEmail().equals(managerEmail)) {
                logger.warn("Manager {} not authorized for hotel {}", managerEmail, review.getHotel().getManagerEmail());
                throw new RuntimeException("Unauthorized to reply to this review");
            }

            if (replyText == null || replyText.trim().isEmpty()) {
                throw new IllegalArgumentException("Reply text cannot be empty");
            }

            logger.info("Setting reply for review {}: {}", reviewId, replyText);

            review.setReplyManagerEmail(managerEmail);
            review.setReplyText(replyText.trim());
            review.setReplyCreatedAt(LocalDateTime.now());

            Review savedReview = reviewRepository.save(review);
            logger.info("Review saved successfully: {}", savedReview.getId());

            // Verify the save worked
            Review verifiedReview = reviewRepository.findById(reviewId).orElse(null);
            if (verifiedReview != null && verifiedReview.getReplyText() != null) {
                logger.info("Reply verified in database: {}", verifiedReview.getReplyText());
            } else {
                logger.error("Reply NOT saved to database for review: {}", reviewId);
            }

            return "Reply added successfully";

        } catch (Exception e) {
            logger.error("Error replying to review {} by manager {}: {}", reviewId, managerEmail, e.getMessage(), e);
            throw e;
        }
    }
}