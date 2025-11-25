package org.example.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.example.entity.LoyaltyHistory;
import org.example.enums.LoyaltyHistoryType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class LoyaltyHistoryResponse {
    private Long id;
    private LoyaltyHistoryType type;
    private Integer points;
    private String description;
    private LocalDateTime date;

    public LoyaltyHistoryResponse(LoyaltyHistory history) {
        this.id = history.getId();
        this.type = history.getType();
        this.points = history.getPoints();
        this.description = history.getDescription();
        this.date = history.getDate();
    }
}