package org.example.service;

import org.example.entity.Hotel;
import org.example.entity.User;
import org.example.enums.HotelStatus;
import org.example.enums.Roles;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.HotelRepository;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setRole(Roles.valueOf(newRole.toUpperCase()));
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        userRepository.delete(user);
    }


    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> getHotelsByStatus(String status) {
        HotelStatus hotelStatus;
        try {
            hotelStatus = HotelStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid hotel status: " + status);
        }
        return hotelRepository.findByStatus(hotelStatus);
    }

    public Hotel approveHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
        hotel.setStatus(HotelStatus.APPROVED);
        return hotelRepository.save(hotel);
    }

    public Hotel rejectHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
        hotel.setStatus(HotelStatus.REJECTED);
        return hotelRepository.save(hotel);
    }

    public Hotel setHotelPending(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
        hotel.setStatus(HotelStatus.PENDING);
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
        hotelRepository.delete(hotel);
    }

    // ✅ Dashboard
    public Map<String, Object> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalHotels = hotelRepository.count();
        long totalBookings = bookingRepository.countAllBookings();
        Double totalRevenue = bookingRepository.sumTotalRevenue();

        long approvedHotels = hotelRepository.findByStatus(HotelStatus.APPROVED).size();
        long pendingHotels = hotelRepository.findByStatus(HotelStatus.PENDING).size();
        long rejectedHotels = hotelRepository.findByStatus(HotelStatus.REJECTED).size();

        return Map.of(
                "totalUsers", totalUsers,
                "totalHotels", totalHotels,
                "approvedHotels", approvedHotels,
                "pendingHotels", pendingHotels,
                "rejectedHotels", rejectedHotels,
                "totalBookings", totalBookings,
                "totalRevenue", totalRevenue != null ? totalRevenue : 0.0
        );
    }
}
