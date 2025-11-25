package org.example.service;

import org.example.dto.Request.BookingRequest;
import org.example.dto.Response.BookingResponse;
import org.example.entity.Booking;
import org.example.entity.Hotel;
import org.example.enums.RoomType;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        Long hotelId = Long.parseLong(request.getHotelId());
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + request.getHotelId()));

        RoomType roomType = RoomType.valueOf(request.getRoomType().toUpperCase());

        Booking booking = Booking.builder()
                .hotel(hotel)
                .userEmail(userEmail)
                .roomType(roomType)
                .checkin(LocalDate.parse(request.getCheckin()))
                .checkout(LocalDate.parse(request.getCheckout()))
                .nights(request.getNights())
                .pricePerNight(request.getPricePerNight())
                .total(request.getTotal())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponse(savedBooking);
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        List<Booking> bookings = bookingRepository.findByUserEmail(userEmail);
        return bookings.stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }
}