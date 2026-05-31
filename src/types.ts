export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Member";
}

export type ReviewStatus = "pending" | "accepted" | "Decliend"; // Standard typo matching user requirements

export interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  status: ReviewStatus;
  createdAt: string;
  userEmail: string;
}

export type OrderCategory = "graphic_design" | "whatsapp_reactions" | "social_boosting";
export type OrderStatus = "pending_verification" | "completed" | "accepted" | "declined" | "delivered";

export interface Order {
  id: string;
  userEmail: string;
  userName: string;
  whatsappNumber: string;
  packageType: string;
  category: OrderCategory;
  paymentScreenshotUrl: string;
  status: OrderStatus;
  amountLkr: string;
  submittedAt: string;
}

export interface WhatsappPrice {
  id: string;
  duration: string;
  priceLkr: string;
}

export interface GraphicDesign {
  id: string;
  name: string;
  description: string;
  priceLkr: string;
  photo: string;
}

export interface BankDetails {
  bankName: string;
  name: string;
  accountNumber: string;
  branch: string;
}

export interface PaymentMethodsConfig {
  bank: BankDetails;
  ezcash: { number: string; available: boolean };
  paypal: { email: string; available: boolean };
}

export interface PaymentMethodRecord {
  id: string; // 'bank' | 'ezcash' | 'paypal'
  name: string;
  details: any;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconName: string;
}
