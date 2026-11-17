export type UserRole = 'CLIENT' | 'PROVIDER';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  // Provider-specific fields
  category?: string;
  bio?: string;
  hourlyRate?: number;
  instagram?: string;
  avatarColor?: string;
}

export interface QuoteRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  providerId: string;
  providerName: string;
  providerCategory: string;
  providerInstagram?: string;
  providerPhone?: string;
  serviceDescription: string;
  preferredDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  quoteId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}
