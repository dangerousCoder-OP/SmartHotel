export type RoomType = "standard" | "deluxe" | "suite";

export type Hotel = {
  id: string;
  name: string;
  location: string;
  images: string[];
  amenities: string[];
  rating: number; // 0-5
  rooms: Record<RoomType, { price: number; available: number }>;
};
