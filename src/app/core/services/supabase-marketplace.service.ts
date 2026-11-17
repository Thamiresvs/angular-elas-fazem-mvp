import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ChatMessage, QuoteRequest, UserProfile } from '../models/marketplace.models';

@Injectable({ providedIn: 'root' })
export class SupabaseMarketplaceService {
  private supabase: SupabaseClient | null = null;

  currentUser = signal<UserProfile | null>(null);
  providers = signal<UserProfile[]>([]);
  quotes = signal<QuoteRequest[]>([]);
  messages = signal<ChatMessage[]>([]);

  private readonly SEED_PROVIDERS: UserProfile[] = [
    {
      id: 'prov-1',
      role: 'PROVIDER',
      fullName: 'Camila Andrade',
      email: 'camila.eletrica@elasfazem.com.br',
      phone: '5521998765432',
      city: 'Rio de Janeiro, RJ',
      category: 'Manutenção & Elétrica',
      bio: 'Eletricista residencial e instaladora certificada. Troca de disjuntores, luminárias, chuveiros e automação básica com segurança.',
      hourlyRate: 110,
      instagram: 'camila.eletricista',
      avatarColor: 'bg-purple-600'
    },
    {
      id: 'prov-2',
      role: 'PROVIDER',
      fullName: 'Fernanda Ribeiro',
      email: 'fernanda.design@elasfazem.com.br',
      phone: '5511987654321',
      city: 'São Paulo, SP',
      category: 'Design & Social Media',
      bio: 'Identidade visual, gestão de Instagram e criação de sites para empreendedoras locais.',
      hourlyRate: 95,
      instagram: 'feribeiro.studio',
      avatarColor: 'bg-rose-600'
    },
    {
      id: 'prov-3',
      role: 'PROVIDER',
      fullName: 'Juliana Costa',
      email: 'ju.marcenaria@elasfazem.com.br',
      phone: '5531991234567',
      city: 'Belo Horizonte, MG',
      category: 'Marcenaria & Montagem',
      bio: 'Montagem de móveis planejados, instalação de prateleiras, suportes de TV e pequenos reparos em madeira.',
      hourlyRate: 100,
      instagram: 'jucosta.reparos',
      avatarColor: 'bg-amber-600'
    },
    {
      id: 'prov-4',
      role: 'PROVIDER',
      fullName: 'Mariana Lopes',
      email: 'mari.tech@elasfazem.com.br',
      phone: '5521996543210',
      city: 'Rio de Janeiro, RJ',
      category: 'Suporte Técnico & TI',
      bio: 'Formatação, configuração de redes Wi-Fi, backup em nuvem e consultoria digital para pequenos negócios.',
      hourlyRate: 120,
      instagram: 'marilopes.tech',
      avatarColor: 'bg-teal-600'
    }
  ];

  private readonly SEED_QUOTES: QuoteRequest[] = [
    {
      id: 'quote-1',
      clientId: 'client-demo',
      clientName: 'Beatriz Martins',
      clientPhone: '5521994443322',
      providerId: 'prov-1',
      providerName: 'Camila Andrade',
      providerCategory: 'Manutenção & Elétrica',
      providerInstagram: 'camila.eletricista',
      providerPhone: '5521998765432',
      serviceDescription: 'Instalação de 3 luminárias de teto e revisão do quadro de disjuntores no apartamento.',
      preferredDate: '2026-11-22',
      status: 'ACCEPTED',
      createdAt: '2026-11-16T10:30:00Z'
    }
  ];

  private readonly SEED_MESSAGES: ChatMessage[] = [
    {
      id: 'msg-1',
      quoteId: 'quote-1',
      senderId: 'client-demo',
      senderName: 'Beatriz Martins',
      content: 'Oi Camila! Tudo bem? Gostaria de confirmar se você atende no bairro Tijuca.',
      createdAt: '2026-11-16T10:32:00Z'
    },
    {
      id: 'msg-2',
      quoteId: 'quote-1',
      senderId: 'prov-1',
      senderName: 'Camila Andrade',
      content: 'Oi Beatriz! Atendo sim, sem taxa extra de deslocamento. Pode ser sábado às 9h?',
      createdAt: '2026-11-16T10:35:00Z'
    }
  ];

  constructor() {
    if (environment.supabaseUrl && environment.supabaseAnonKey) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    }
    this.bootstrapState();
  }

  private bootstrapState(): void {
    const storedProviders = localStorage.getItem('ef_providers');
    if (!storedProviders) {
      localStorage.setItem('ef_providers', JSON.stringify(this.SEED_PROVIDERS));
      this.providers.set(this.SEED_PROVIDERS);
    } else {
      this.providers.set(JSON.parse(storedProviders));
    }

    const storedQuotes = localStorage.getItem('ef_quotes');
    if (!storedQuotes) {
      localStorage.setItem('ef_quotes', JSON.stringify(this.SEED_QUOTES));
      this.quotes.set(this.SEED_QUOTES);
    } else {
      this.quotes.set(JSON.parse(storedQuotes));
    }

    const storedMessages = localStorage.getItem('ef_messages');
    if (!storedMessages) {
      localStorage.setItem('ef_messages', JSON.stringify(this.SEED_MESSAGES));
      this.messages.set(this.SEED_MESSAGES);
    } else {
      this.messages.set(JSON.parse(storedMessages));
    }

    const storedUser = localStorage.getItem('ef_current_user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  async registerUser(profileData: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const newUser: UserProfile = {
      ...profileData,
      id: `${profileData.role.toLowerCase()}-${Date.now()}`,
      avatarColor: profileData.role === 'PROVIDER' ? 'bg-purple-600' : 'bg-rose-500'
    };

    if (this.supabase) {
      await this.supabase.from('profiles').insert({
        role: newUser.role,
        full_name: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        city: newUser.city,
        category: newUser.category,
        bio: newUser.bio,
        hourly_rate: newUser.hourlyRate,
        instagram: newUser.instagram
      });
    }

    if (newUser.role === 'PROVIDER') {
      const updatedProviders = [newUser, ...this.providers()];
      this.providers.set(updatedProviders);
      localStorage.setItem('ef_providers', JSON.stringify(updatedProviders));
    }

    this.currentUser.set(newUser);
    localStorage.setItem('ef_current_user', JSON.stringify(newUser));
    return newUser;
  }

  loginDemo(role: 'CLIENT' | 'PROVIDER'): void {
    if (role === 'PROVIDER') {
      const prov = this.providers()[0];
      this.currentUser.set(prov);
      localStorage.setItem('ef_current_user', JSON.stringify(prov));
    } else {
      const client: UserProfile = {
        id: 'client-demo',
        role: 'CLIENT',
        fullName: 'Beatriz Martins',
        email: 'beatriz.cliente@elasfazem.com.br',
        phone: '5521994443322',
        city: 'Rio de Janeiro, RJ'
      };
      this.currentUser.set(client);
      localStorage.setItem('ef_current_user', JSON.stringify(client));
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('ef_current_user');
  }

  async createQuote(provider: UserProfile, serviceDescription: string, preferredDate: string): Promise<QuoteRequest> {
    const user = this.currentUser();
    const client: UserProfile = user ?? {
      id: 'client-demo',
      role: 'CLIENT',
      fullName: 'Beatriz Martins',
      email: 'beatriz.cliente@elasfazem.com.br',
      phone: '5521994443322',
      city: provider.city
    };

    const newQuote: QuoteRequest = {
      id: `quote-${Date.now()}`,
      clientId: client.id,
      clientName: client.fullName,
      clientPhone: client.phone,
      providerId: provider.id,
      providerName: provider.fullName,
      providerCategory: provider.category ?? 'Serviços Gerais',
      providerInstagram: provider.instagram,
      providerPhone: provider.phone,
      serviceDescription,
      preferredDate,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    const updated = [newQuote, ...this.quotes()];
    this.quotes.set(updated);
    localStorage.setItem('ef_quotes', JSON.stringify(updated));
    return newQuote;
  }

  updateQuoteStatus(quoteId: string, status: QuoteRequest['status']): void {
    const updated = this.quotes().map(q => q.id === quoteId ? { ...q, status } : q);
    this.quotes.set(updated);
    localStorage.setItem('ef_quotes', JSON.stringify(updated));
  }

  sendMessage(quoteId: string, content: string): void {
    const user = this.currentUser();
    if (!user || !content.trim()) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      quoteId,
      senderId: user.id,
      senderName: user.fullName,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [...this.messages(), msg];
    this.messages.set(updated);
    localStorage.setItem('ef_messages', JSON.stringify(updated));

    if (this.supabase) {
      this.supabase.from('messages').insert({
        quote_id: quoteId,
        sender_id: user.id,
        sender_name: user.fullName,
        content: msg.content
      });
    }
  }

  getWhatsAppUrl(phone?: string, recipientName?: string, isProviderContactingClient = false): string {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    const rawMsg = isProviderContactingClient
      ? `Olá ${recipientName ?? ''}! Recebi sua solicitação de orçamento pela plataforma Elas Fazem e gostaria de conversar sobre o serviço.`
      : `Olá ${recipientName ?? ''}! Encontrei seu perfil na plataforma Elas Fazem e gostaria de solicitar um orçamento.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawMsg)}`;
  }

  getInstagramUrl(instagram?: string): string {
    if (!instagram) return '';
    const handle = instagram.replace('@', '').trim();
    return `https://instagram.com/${handle}`;
  }
}
