package org.example.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.example.entity.Payment;
import org.example.enums.PaymentMethod;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class PaymentResponse {
    private Long id;
    private String bookingId;
    private String userEmail;
    private Double amount;
    private String method;
    private String details;
    private LocalDateTime createdAt;
    private Integer loyaltyPointsEarned;
    private Integer loyaltyPointsUsed;

    public PaymentResponse(Payment payment) {
        this.id = payment.getId();
        this.bookingId = payment.getBooking().getId().toString();
        this.userEmail = payment.getUserEmail();
        this.amount = payment.getAmount();
        this.method = payment.getMethod().name();
        this.details = payment.getDetails();
        this.createdAt = payment.getCreatedAt();
        // Default values - you might want to calculate these based on business logic
        this.loyaltyPointsEarned = 50; // Fixed 50 points per payment
        this.loyaltyPointsUsed = 0; // This would need to be stored in payment entity
    }
}