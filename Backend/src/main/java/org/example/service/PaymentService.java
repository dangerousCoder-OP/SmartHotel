package org.example.service;

import org.example.dto.Response.PaymentResponse;
import org.example.entity.Booking;
import org.example.entity.Payment;
import org.example.enums.BookingStatus;
import org.example.enums.PaymentMethod;
import org.example.exceptions.DuplicatePaymentException;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LoyaltyService loyaltyService;

    @Transactional
    public PaymentResponse createPayment(Map<String, Object> paymentData, String userEmail) {
        try {
            logger.info("Creating payment for user: {}, data: {}", userEmail, paymentData);

            // Validate required fields
            if (!paymentData.containsKey("bookingId") || !paymentData.containsKey("amount")
                    || !paymentData.containsKey("method")) {
                throw new IllegalArgumentException("Missing required payment fields: bookingId, amount, and method are required");
            }

            Long bookingId = Long.valueOf(paymentData.get("bookingId").toString());
            Double originalAmount = Double.valueOf(paymentData.get("amount").toString());
            String method = paymentData.get("method").toString();
            String details = paymentData.getOrDefault("details", "").toString();

            // Check if loyalty points are being used
            Integer loyaltyPointsUsed = 0;
            Double finalAmount = originalAmount;

            if (paymentData.containsKey("loyaltyPointsUsed") && paymentData.get("loyaltyPointsUsed") != null) {
                try {
                    loyaltyPointsUsed = Integer.valueOf(paymentData.get("loyaltyPointsUsed").toString());
                    if (loyaltyPointsUsed > 0) {
                        // Convert points to currency (assuming 1 point = 1 currency unit)
                        Double pointsDiscount = loyaltyPointsUsed.doubleValue();
                        finalAmount = Math.max(0, originalAmount - pointsDiscount);
                        logger.info("Using {} loyalty points, discount: {}, final amount: {}",
                                loyaltyPointsUsed, pointsDiscount, finalAmount);
                    }
                } catch (NumberFormatException e) {
                    logger.warn("Invalid loyaltyPointsUsed value: {}", paymentData.get("loyaltyPointsUsed"));
                }
            }

            logger.debug("Parsed payment - bookingId: {}, original amount: {}, final amount: {}, method: '{}', loyalty points used: {}",
                    bookingId, originalAmount, finalAmount, method, loyaltyPointsUsed);

            PaymentMethod paymentMethod = parsePaymentMethod(method);

            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

            if (!booking.getUserEmail().equals(userEmail)) {
                throw new RuntimeException("Unauthorized to pay for this booking");
            }

            // ✅ Prevent duplicate payment
            if (paymentRepository.existsByBooking(booking)) {
                throw new DuplicatePaymentException("Payment already exists for booking ID " + bookingId);
            }

            Payment payment = Payment.builder()
                    .booking(booking)
                    .userEmail(userEmail)
                    .amount(finalAmount) // Use final amount after loyalty discount
                    .method(paymentMethod)
                    .details(details)
                    .build();

            Payment savedPayment = paymentRepository.save(payment);

            booking.setStatus(BookingStatus.PAID);
            bookingRepository.save(booking);

            // ✅ Award 50 loyalty points for every payment
            int pointsEarned = 50;
            loyaltyService.awardPoints(userEmail, pointsEarned, "Payment for booking #" + bookingId);

            // ✅ Redeem loyalty points if any were used
            if (loyaltyPointsUsed > 0) {
                loyaltyService.redeemPoints(userEmail, loyaltyPointsUsed, "Payment discount for booking #" + bookingId);
            }

            logger.info("Payment created successfully: {}. Points earned: {}, Points used: {}",
                    savedPayment.getId(), pointsEarned, loyaltyPointsUsed);

            // Return DTO instead of entity
            return new PaymentResponse(savedPayment);

        } catch (Exception e) {
            logger.error("Error creating payment for user {}: {}", userEmail, e.getMessage(), e);
            throw e;
        }
    }

    public List<PaymentResponse> getUserPayments(String userEmail) {
        List<Payment> payments = paymentRepository.findByUserEmail(userEmail);
        return payments.stream()
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
    }

    private PaymentMethod parsePaymentMethod(String method) {
        if (method == null || method.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment method cannot be empty");
        }

        String cleanedMethod = method.trim()
                .toUpperCase()
                .replace(" ", "_")
                .replace("-", "_")
                .replace("\"", ""); // Remove quotes if present

        logger.debug("DEBUG - Cleaned method: '{}'", cleanedMethod);

        try {
            return PaymentMethod.valueOf(cleanedMethod);
        } catch (IllegalArgumentException e) {
            // Add more flexible matching for common variations
            if (cleanedMethod.contains("CREDIT") || cleanedMethod.contains("CARD") || "CC".equals(cleanedMethod)) {
                return PaymentMethod.CREDIT_CARD;
            } else if (cleanedMethod.contains("DEBIT")) {
                return PaymentMethod.DEBIT_CARD;
            } else if (cleanedMethod.contains("PAYPAL")) {
                return PaymentMethod.PAYPAL;
            } else if (cleanedMethod.contains("BANK") || cleanedMethod.contains("TRANSFER")) {
                return PaymentMethod.BANK_TRANSFER;
            } else if (cleanedMethod.contains("CASH")) {
                return PaymentMethod.CASH;
            } else if (cleanedMethod.contains("UPI")) {
                return PaymentMethod.DIGITAL_WALLET; // Map UPI to DIGITAL_WALLET
            }

            String validMethods = Arrays.toString(PaymentMethod.values());
            throw new IllegalArgumentException(
                    "Invalid payment method: '" + method + "'. " +
                            "Valid methods are: " + validMethods
            );
        }
    }
}