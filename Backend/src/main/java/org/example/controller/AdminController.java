package org.example.controller;

import org.example.entity.Hotel;
import org.example.entity.User;
import org.example.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173"})
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/hotels")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(adminService.getAllHotels());
    }

    @GetMapping("/hotels/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Hotel>> getHotelsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(adminService.getHotelsByStatus(status.toUpperCase()));
    }

    @PutMapping("/hotels/{hotelId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hotel> approveHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(adminService.approveHotel(hotelId));
    }

    @PutMapping("/hotels/{hotelId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hotel> rejectHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(adminService.rejectHotel(hotelId));
    }
}
