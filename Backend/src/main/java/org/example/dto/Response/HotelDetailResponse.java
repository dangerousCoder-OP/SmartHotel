package org.example.dto.Response;

import org.example.entity.Hotel;
import org.example.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class HotelDetailResponse {
    private String id;
    private String name;
    private String[] images;
    private String[] amenities;
    private Double rating;
    private String location;
    private Map<String, RoomInfo> rooms;

    public HotelDetailResponse(Hotel hotel) {
        this.id = hotel.getId().toString();
        this.name = hotel.getName();
        this.images = hotel.getImages().toArray(new String[0]);
        this.amenities = hotel.getAmenities().toArray(new String[0]);
        this.rating = hotel.getRating();
        this.location = hotel.getLocation();

        this.rooms = new HashMap<>();
        for (Room room : hotel.getRooms()) {
            this.rooms.put(room.getType().name().toLowerCase(),
                    new RoomInfo(room.getPrice(), room.getAvailable()));
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Accessors(chain = true)
    public static class RoomInfo {
        private Double price;
        private Integer available;
    }
}