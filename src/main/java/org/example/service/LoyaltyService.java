package org.example.service;

import org.example.dto.Response.LoyaltyResponse;
import org.example.dto.Response.LoyaltyHistoryResponse;
import org.example.entity.Loyalty;
import org.example.entity.LoyaltyHistory;
import org.example.enums.LoyaltyHistoryType;
import org.example.repository.LoyaltyHistoryRepository;
import org.example.repository.LoyaltyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoyaltyService {

    @Autowired
    private LoyaltyRepository loyaltyRepository;

    @Autowired
    private LoyaltyHistoryRepository loyaltyHistoryRepository;

    public Loyalty getUserLoyalty(String userEmail) {
        return loyaltyRepository.findByUserEmail(userEmail)
                .orElseGet(() -> createLoyaltyAccount(userEmail));
    }

    public LoyaltyResponse getUserLoyaltyResponse(String userEmail) {
        Loyalty loyalty = getUserLoyalty(userEmail);
        List<LoyaltyHistoryResponse> history = getLoyaltyHistory(userEmail);
        return new LoyaltyResponse(loyalty, history);
    }

    public List<LoyaltyHistoryResponse> getLoyaltyHistory(String userEmail) {
        // Use the query method that works with userEmail
        List<LoyaltyHistory> history = loyaltyHistoryRepository.findByUserEmailOrderByDateDesc(userEmail);

        return history.stream()
                .map(LoyaltyHistoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public LoyaltyResponse redeemPointsResponse(String userEmail, Integer points) {
        Loyalty loyalty = redeemPoints(userEmail, points);
        List<LoyaltyHistoryResponse> history = getLoyaltyHistory(userEmail);
        return new LoyaltyResponse(loyalty, history);
    }

    @Transactional
    public void awardPoints(String userEmail, Integer points, String description) {
        Loyalty loyalty = getUserLoyalty(userEmail);

        loyalty.setPoints(loyalty.getPoints() + points);
        loyalty.setAvailable(loyalty.getAvailable() + points);
        loyalty.setTotalEarned(loyalty.getTotalEarned() + points);

        loyaltyRepository.save(loyalty);

        LoyaltyHistory history = LoyaltyHistory.builder()
                .loyalty(loyalty)
                .type(LoyaltyHistoryType.EARNED)
                .points(points)
                .description(description)
                .build();
        loyaltyHistoryRepository.save(history);
    }

    @Transactional
    public Loyalty redeemPoints(String userEmail, Integer points, String description) {
        Loyalty loyalty = getUserLoyalty(userEmail);

        if (loyalty.getAvailable() < points) {
            throw new RuntimeException("Insufficient loyalty points. Available: " + loyalty.getAvailable() + ", Requested: " + points);
        }

        loyalty.setAvailable(loyalty.getAvailable() - points);
        loyalty.setTotalRedeemed(loyalty.getTotalRedeemed() + points);

        loyaltyRepository.save(loyalty);

        LoyaltyHistory history = LoyaltyHistory.builder()
                .loyalty(loyalty)
                .type(LoyaltyHistoryType.REDEEMED)
                .points(points)
                .description(description)
                .build();
        loyaltyHistoryRepository.save(history);

        return loyalty;
    }

    @Transactional
    public Loyalty redeemPoints(String userEmail, Integer points) {
        return redeemPoints(userEmail, points, "Points redemption");
    }

    private Loyalty createLoyaltyAccount(String userEmail) {
        Loyalty loyalty = Loyalty.builder()
                .userEmail(userEmail)
                .points(0)
                .available(0)
                .totalEarned(0)
                .totalRedeemed(0)
                .build();
        return loyaltyRepository.save(loyalty);
    }

    public Double calculateDiscountFromPoints(String userEmail, Integer pointsToUse) {
        Loyalty loyalty = getUserLoyalty(userEmail);

        if (pointsToUse > loyalty.getAvailable()) {
            throw new RuntimeException("Insufficient loyalty points. Available: " + loyalty.getAvailable());
        }

        return pointsToUse.doubleValue();
    }
}