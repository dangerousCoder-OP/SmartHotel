package org.example.dto.Response;

import org.example.entity.Hotel;
import org.example.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.example.entity.Room;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class HotelSummaryResponse {
    private String id;
    private String name;
    private String image;
    private String[] amenities;
    private Double rating;
    private Double price;
    private String location;

    public HotelSummaryResponse(Hotel hotel, RoomType roomType) {
        this.id = hotel.getId().toString();
        this.name = hotel.getName();
        this.image = hotel.getImages().isEmpty() ? "" : hotel.getImages().get(0);
        this.amenities = hotel.getAmenities().toArray(new String[0]);
        this.rating = hotel.getRating();
        this.location = hotel.getLocation();

        this.price = hotel.getRooms().stream()
                .filter(room -> roomType == null || room.getType() == roomType)
                .findFirst()
                .map(Room::getPrice)
                .orElse(0.0);
    }
}