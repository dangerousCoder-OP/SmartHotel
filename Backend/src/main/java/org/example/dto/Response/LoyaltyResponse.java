package org.example.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.example.entity.Loyalty;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class LoyaltyResponse {
    private Long id;
    private String userEmail;
    private Integer points;
    private Integer available;
    private Integer totalEarned;
    private Integer totalRedeemed;
    private List<LoyaltyHistoryResponse> history;

    public LoyaltyResponse(Loyalty loyalty) {
        this.id = loyalty.getId();
        this.userEmail = loyalty.getUserEmail();
        this.points = loyalty.getPoints();
        this.available = loyalty.getAvailable();
        this.totalEarned = loyalty.getTotalEarned();
        this.totalRedeemed = loyalty.getTotalRedeemed();
        this.history = null;
    }

    public LoyaltyResponse(Loyalty loyalty, List<LoyaltyHistoryResponse> history) {
        this(loyalty);
        this.history = history;
    }
}