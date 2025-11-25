import api from "./api";
import type { RoomType, Booking, Review, HotelRequest } from "@/models/types";

export type ManagerHotel = {
  id: string;
  name: string;
  location: string;
  images: string[];
  amenities: string[];
  rating: number;
  rooms: Record<RoomType, { price: number; available: number }>;
  description?: string;
  status?: "approved" | "pending" | "rejected";
};

export type NewHotelPayload = {
  name: string;
  location: string;
  description?: string;
  amenities: string[];
  imageUrl: string;
  rooms: { type: RoomType; price: number; available: number }[];
};
export const replyToReview = async (
  reviewId: string,
  replyText: string
): Promise<Review> => {
  const response = await api.post(`/api/manager/reviews/${reviewId}/reply`, {
    reply: replyText,
  });
  return response.data;
};

export async function getMyHotels(managerEmail: string) {
  const res = await api.get("/api/manager/hotels");
  return res.data as ManagerHotel[];
}

export async function addHotel(payload: NewHotelPayload) {
  const res = await api.post("/api/manager/hotels", payload);
  return res.data as ManagerHotel;
}

export async function getManagerBookings(managerEmail: string) {
  const res = await api.get("/api/manager/bookings");
  return res.data as Booking[];
}

export async function getManagerReviews(managerEmail: string) {
  const res = await api.get("/api/manager/reviews");
  return res.data as Review[];
}
