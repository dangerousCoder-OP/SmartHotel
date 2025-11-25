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
public class ManagerReviewResponse {
    private Long id;
    private String bookingId;
    private String hotelId;
    private String hotelName;
    private String userEmail;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private String replyManagerEmail;
    private String replyText;
    private LocalDateTime replyCreatedAt;

    public ManagerReviewResponse(Review review) {
        this.id = review.getId();
        this.bookingId = review.getBooking().getId().toString();
        this.hotelId = review.getHotel().getId().toString();
        this.hotelName = review.getHotel().getName();
        this.userEmail = review.getUserEmail();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
        this.replyManagerEmail = review.getReplyManagerEmail();
        this.replyText = review.getReplyText();
        this.replyCreatedAt = review.getReplyCreatedAt();
    }
}