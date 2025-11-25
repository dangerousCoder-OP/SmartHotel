package org.example.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.example.entity.Hotel;
import org.example.enums.HotelStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ManagerHotelResponse {
    private Long id;
    private String name;
    private String location;
    private String description;
    private List<String> images;
    private List<String> amenities;
    private String managerEmail;
    private HotelStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ManagerHotelResponse(Hotel hotel) {
        this.id = hotel.getId();
        this.name = hotel.getName();
        this.location = hotel.getLocation();
        this.description = hotel.getDescription();
        this.images = hotel.getImages();
        this.amenities = hotel.getAmenities();
        this.managerEmail = hotel.getManagerEmail();
        this.status = hotel.getStatus();
        this.createdAt = hotel.getCreatedAt();
        this.updatedAt = hotel.getUpdatedAt();
    }
}