
import { User, BuyerProfile, SellerProfile } from "@/types";

export const getMockUserByEmail = (email: string, password: string): User | null => {
  if (email === "buyer@example.com" && password === "buyerpass") {
    return {
      id: "buyer-123",
      email: "buyer@example.com",
      fullName: "John Buyer",
      userType: "buyer",
      isPhoneVerified: true,
      preferredAuthMethod: "email",
      createdAt: new Date(),
    };
  } else if (email === "seller@example.com" && password === "sellerpass") {
    return {
      id: "seller-456",
      email: "seller@example.com",
      fullName: "Jane Seller",
      userType: "seller",
      isPhoneVerified: true,
      preferredAuthMethod: "email",
      createdAt: new Date(),
    };
  }
  return null;
};

export const createMockUser = (
  email: string,
  fullName: string,
  userType: "buyer" | "seller",
  preferredAuthMethod: "email" | "phone" = "email",
  phoneNumber?: string
): User => {
  return {
    id: "user-" + Math.random().toString(36).substring(7),
    email,
    phoneNumber,
    fullName,
    userType,
    isPhoneVerified: false,
    preferredAuthMethod,
    createdAt: new Date(),
  };
};

export const createMockBuyerProfile = (userId: string): BuyerProfile => {
  return {
    id: `buyer-${userId}`,
    userId,
    deliveryPreferences: {},
    paymentMethods: {},
    notificationPreferences: {},
  };
};

export const createMockSellerProfile = (userId: string): SellerProfile => {
  return {
    id: `seller-${userId}`,
    userId,
    businessName: "Farm Fresh Produce",
    businessDescription: "Local organic farm produce",
    verificationStatus: 'verified',
    averageRating: 4.5,
    totalRatings: 27,
  };
};
