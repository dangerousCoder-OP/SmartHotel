package org.example.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.example.entity.Review;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ReviewResponse {
    private Long id;
    private String bookingId;
    private String hotelId;
    private String hotelName;
    private String userEmail;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    // Add reply fields
    private String replyManagerEmail;
    private String replyText;
    private LocalDateTime replyCreatedAt;
    private Boolean hasReply; // Helper field for frontend

    public ReviewResponse(Review review) {
        this.id = review.getId();
        this.bookingId = review.getBooking().getId().toString();
        this.hotelId = review.getHotel().getId().toString();
        this.hotelName = review.getHotel().getName();
        this.userEmail = review.getUserEmail();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();

        // Map reply fields
        this.replyManagerEmail = review.getReplyManagerEmail();
        this.replyText = review.getReplyText();
        this.replyCreatedAt = review.getReplyCreatedAt();
        this.hasReply = review.getReplyText() != null && !review.getReplyText().trim().isEmpty();
    }
}