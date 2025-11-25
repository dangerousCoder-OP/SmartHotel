package org.example.dto.Response;

import org.example.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class BookingResponse {
    private String id;
    private String hotelId;
    private String hotelName;
    private String userEmail;
    private String roomType;
    private String checkin;
    private String checkout;
    private Integer nights;
    private Double pricePerNight;
    private Double total;
    private String status;

    public BookingResponse(Booking booking) {
        this.id = booking.getId().toString();
        this.hotelId = booking.getHotel().getId().toString();
        this.hotelName = booking.getHotel().getName();
        this.userEmail = booking.getUserEmail();
        this.roomType = booking.getRoomType().name().toLowerCase();
        this.checkin = booking.getCheckin().toString();
        this.checkout = booking.getCheckout().toString();
        this.nights = booking.getNights();
        this.pricePerNight = booking.getPricePerNight();
        this.total = booking.getTotal();
        this.status = booking.getStatus().name().toLowerCase();
    }
}