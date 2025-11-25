import api from "./api";
import type { RoomType, HotelRequest, User } from "@/models/types";

export type AdminHotel = {
  id: number;
  name: string;
  location: string;
  images: string[];
  amenities: string[];
  rating: number;
  rooms: Record<RoomType, { price: number; available: number }>;
  description?: string;
  status: "approved" | "pending" | "rejected";
  managerEmail: string | null;
  createdAt?: string;
};

// Hotel endpoints
export async function getHotelsByStatus(
  status: "approved" | "pending" | "rejected"
) {
  const res = await api.get(`/api/admin/hotels/${status}`);
  return res.data as AdminHotel[];
}

export async function getAllHotels() {
  const res = await api.get("/api/admin/hotels");
  return res.data as AdminHotel[];
}

export async function approveHotel(id: string) {
  const res = await api.put(`/api/admin/hotels/${id}/approve`);
  return res.data as string;
}

export async function rejectHotel(id: string) {
  const res = await api.put(`/api/admin/hotels/${id}/reject`);
  return res.data as string;
}

export async function setHotelPending(id: string) {
  const res = await api.put(`/api/admin/hotels/${id}/pending`);
  return res.data as string;
}

export async function deleteHotel(id: string) {
  const res = await api.delete(`/api/admin/hotels/${id}`);
  return res.data as string;
}

// User endpoints
export async function getAllUsers() {
  const res = await api.get("/api/admin/users");
  return res.data as User[];
}

export async function updateUserRole(userId: number, role: string) {
  const res = await api.put(`/api/admin/users/${userId}/role`, { role });
  return res.data as string;
}

export async function deleteUser(userId: number) {
  const res = await api.delete(`/api/admin/users/${userId}`);
  return res.data as string;
}

// Dashboard endpoints
export async function getDashboardStats() {
  const res = await api.get("/api/admin/dashboard/stats");
  return res.data as Record<string, any>;
}
