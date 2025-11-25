package org.example.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.enums.LoyaltyHistoryType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loyalty_id", nullable = false)
    private Loyalty loyalty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoyaltyHistoryType type;

    @Column(nullable = false)
    private Integer points;

    private String description;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime date = LocalDateTime.now();
}