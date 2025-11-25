import api from "./api";
import type {
  RoomType,
  HotelSummary,
  HotelDetail,
  Booking,
  Payment,
  Review,
  LoyaltyInfo,
} from "@/models/types";

export interface BookingRequest {
  hotelId: string;
  userEmail: string;
  roomType: string;
  checkin: string;
  checkout: string;
  nights: number;
  pricePerNight: number;
  total: number;
}

export interface PaymentRequest {
  bookingId: string;
  userEmail: string;
  amount: number;
  method: string;
  details: any;
  loyaltyPointsUsed?: number;
}

export const createPayment = async (paymentData: PaymentRequest) => {
  const response = await api.post("/api/user/payments", paymentData);
  return response.data;
};
// Manager functions
export const getManagerReviews = async (
  managerEmail: string
): Promise<Review[]> => {
  const response = await api.get(`/api/manager/reviews`);
  return response.data;
};

export const replyToReview = async (
  reviewId: string,
  replyText: string
): Promise<void> => {
  const response = await api.post(`/api/manager/reviews/${reviewId}/reply`, {
    reply: replyText,
  });
  return response.data;
};
// ... other service functions remain the same

export async function searchHotels(params: {
  location: string;
  roomType: RoomType;
}) {
  const res = await api.get("/api/hotels", { params });
  return res.data as HotelSummary[];
}

export async function getHotel(id: string) {
  const res = await api.get(`/api/hotels/${id}`);
  return res.data as HotelDetail;
}

export async function createBooking(
  data: Omit<Booking, "id" | "status" | "hotelName">
) {
  const res = await api.post("/api/user/bookings", data);
  return res.data as Booking;
}

export async function listBookings(userEmail: string) {
  const res = await api.get("/api/user/bookings");
  return res.data as Booking[];
}

export async function listPayments(userEmail: string) {
  const res = await api.get("/api/user/payments");
  return res.data as Payment[];
}

export async function addReview(data: Omit<Review, "id" | "createdAt">) {
  const res = await api.post("/api/user/reviews", data);
  return res.data as Review;
}

export async function listReviews(userEmail: string) {
  const res = await api.get("/api/user/reviews");
  return res.data as Review[];
}

export async function getLoyalty(userEmail) {
  const res = await api.get("/api/user/loyalty");
  return res.data;
}

export async function redeemLoyalty(userEmail, points) {
  const res = await api.post("/api/user/loyalty/redeem", { points });
  return res.data;
}
