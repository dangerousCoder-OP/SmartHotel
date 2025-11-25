package org.example.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.example.enums.BookingStatus;
import org.example.enums.RoomType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    @JsonIgnore
    private Hotel hotel;

    @NotNull
    private String userEmail;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    @NotNull
    private LocalDate checkin;

    @NotNull
    private LocalDate checkout;

    @NotNull
    private Integer nights;

    @NotNull
    private Double pricePerNight;

    @NotNull
    private Double total;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    @CreationTimestamp
    private LocalDateTime createdAt;
}