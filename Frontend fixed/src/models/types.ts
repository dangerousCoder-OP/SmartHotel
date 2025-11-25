export type RoomType = 'standard' | 'deluxe' | 'suite';

export type HotelSummary = {
  id: string;
  name: string;
  image: string;
  amenities: string[];
  rating: number;
  price: number; // price for selected room type
  location: string;
};

export type HotelDetail = {
  id: string;
  name: string;
  images: string[];
  amenities: string[];
  rating: number;
  location: string;
  rooms: Record<RoomType, { price: number; available: number }>;
};

export type Booking = {
  id: string;
  hotelId: string;
  hotelName: string;
  userEmail: string;
  roomType: RoomType;
  checkin: string;
  checkout: string;
  nights: number;
  pricePerNight: number;
  total: number;
  status: 'pending_payment' | 'paid';
};

export type Payment = {
  id: string;
  bookingId: string;
  userEmail: string;
  amount: number;
  method: 'upi' | 'card';
  createdAt: string;
  details?: any;
};

export type Review = {
  id: string;
  bookingId: string;
  hotelId: string;
  hotelName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: { managerEmail: string; text: string; createdAt: string };
};

export type LoyaltyHistoryItem = { 
  id: string; 
  type: 'earned' | 'redeemed'; 
  points: number; 
  description: string; 
  date: string 
};

export type LoyaltyInfo = { 
  points: number; 
  available: number; 
  totalEarned: number; 
  totalRedeemed: number; 
  history: LoyaltyHistoryItem[] 
};

export type User = {
  id?: string;
  email: string;
  role: 'user' | 'manager' | 'admin';
  name?: string;
};

// Backend login response shape
export type LoginResponse = {
  username: string;
  roles: string[];
  jwtToken: string;
};

export type HotelRequest = {
  id: string;
  name: string;
  location: string;
  amenities: string[];
  rooms: Record<RoomType, { price: number; available: number }>;
  images: string[];
  managerEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};