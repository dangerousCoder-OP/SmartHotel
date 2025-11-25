package org.example.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.example.entity.Booking;
import org.example.enums.BookingStatus;
import org.example.enums.RoomType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ManagerBookingResponse {
    private Long id;
    private String hotelId;
    private String hotelName;
    private String userEmail;
    private RoomType roomType;
    private LocalDate checkin;
    private LocalDate checkout;
    private Integer nights;
    private Double pricePerNight;
    private Double total;
    private BookingStatus status;
    private LocalDateTime createdAt;

    public ManagerBookingResponse(Booking booking) {
        this.id = booking.getId();
        this.hotelId = booking.getHotel().getId().toString();
        this.hotelName = booking.getHotel().getName();
        this.userEmail = booking.getUserEmail();
        this.roomType = booking.getRoomType();
        this.checkin = booking.getCheckin();
        this.checkout = booking.getCheckout();
        this.nights = booking.getNights();
        this.pricePerNight = booking.getPricePerNight();
        this.total = booking.getTotal();
        this.status = booking.getStatus();
        this.createdAt = booking.getCreatedAt();
    }
}