import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseMarketplaceService } from '../../core/services/supabase-marketplace.service';
import { QuoteRequest } from '../../core/models/marketplace.models';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto py-8 px-4">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Orçamentos & Mensagens</h1>
          <p class="text-sm text-slate-500">Acompanhe solicitações, converse em tempo real ou chame diretamente no WhatsApp</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Lista de Orçamentos -->
        <div class="lg:col-span-5 space-y-3">
          @for (q of service.quotes(); track q.id) {
            <div (click)="selectedQuoteId.set(q.id)"
              class="bg-white p-4 rounded-2xl border cursor-pointer transition"
              [ngClass]="selectedQuote()?.id === q.id ? 'border-purple-600 ring-2 ring-purple-100' : 'border-slate-200 hover:border-purple-300'">
              <div class="flex justify-between items-start gap-2">
                <div>
                  <span class="text-xs font-semibold text-purple-700">{{ q.providerCategory }}</span>
                  <h3 class="font-bold text-slate-900 text-sm mt-0.5">
                    Prestadora: {{ q.providerName }}
                  </h3>
                  <p class="text-xs text-slate-500">Cliente: {{ q.clientName }}</p>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  [ngClass]="{
                    'bg-amber-100 text-amber-700': q.status === 'PENDING',
                    'bg-emerald-100 text-emerald-700': q.status === 'ACCEPTED',
                    'bg-rose-100 text-rose-700': q.status === 'DECLINED'
                  }">
                  {{ q.status === 'PENDING' ? 'Aguardando' : q.status === 'ACCEPTED' ? 'Aceito' : 'Recusado' }}
                </span>
              </div>

              <p class="text-xs text-slate-600 mt-3 line-clamp-2">{{ q.serviceDescription }}</p>

              <!-- Ações da Prestadora -->
              @if (service.currentUser()?.role === 'PROVIDER' && q.status === 'PENDING') {
                <div class="mt-3 pt-3 border-t border-slate-100 flex gap-2" (click)="$event.stopPropagation()">
                  <button (click)="service.updateQuoteStatus(q.id, 'ACCEPTED')"
                    class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700">
                    Aceitar Pedido
                  </button>
                  <button (click)="service.updateQuoteStatus(q.id, 'DECLINED')"
                    class="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300">
                    Recusar
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Painel de Chat Integrado + Links Diretos -->
        <div class="lg:col-span-7">
          @if (selectedQuote(); as quote) {
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
              <!-- Cabeçalho do Chat com WhatsApp e Instagram -->
              <div class="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 class="font-bold text-slate-900 text-sm">
                    {{ service.currentUser()?.role === 'PROVIDER' ? 'Cliente: ' + quote.clientName : 'Prestadora: ' + quote.providerName }}
                  </h2>
                  <p class="text-xs text-slate-500">Data sugerida: {{ quote.preferredDate }}</p>
                </div>
                <div class="flex items-center gap-2">
                  @if (service.currentUser()?.role === 'PROVIDER') {
                    @if (quote.clientPhone) {
                      <a [href]="service.getWhatsAppUrl(quote.clientPhone, quote.clientName, true)" target="_blank" rel="noopener"
                        class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold">
                        WhatsApp do Cliente
                      </a>
                    }
                  } @else {
                    @if (quote.providerPhone) {
                      <a [href]="service.getWhatsAppUrl(quote.providerPhone, quote.providerName)" target="_blank" rel="noopener"
                        class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold">
                        WhatsApp
                      </a>
                    }
                    @if (quote.providerInstagram) {
                      <a [href]="service.getInstagramUrl(quote.providerInstagram)" target="_blank" rel="noopener"
                        class="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs font-semibold">
                        Instagram
                      </a>
                    }
                  }
                </div>
              </div>

              <!-- Resumo do Pedido -->
              <div class="px-4 py-2.5 bg-purple-50/60 border-b border-purple-100 text-xs text-slate-700">
                <strong>Solicitação:</strong> {{ quote.serviceDescription }}
              </div>

              <!-- Mensagens -->
              <div class="flex-1 p-4 overflow-y-auto space-y-3">
                @for (msg of activeMessages(); track msg.id) {
                  <div class="flex flex-col"
                    [ngClass]="msg.senderId === service.currentUser()?.id ? 'items-end' : 'items-start'">
                    <span class="text-[11px] text-slate-400 mb-0.5">{{ msg.senderName }}</span>
                    <div class="px-4 py-2.5 rounded-2xl text-sm max-w-md"
                      [ngClass]="msg.senderId === service.currentUser()?.id
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'">
                      {{ msg.content }}
                    </div>
                  </div>
                }
              </div>

              <!-- Input de Envio -->
              <form (ngSubmit)="send()" class="p-3 border-t border-slate-100 flex gap-2">
                <input [(ngModel)]="newMessage" name="message" placeholder="Escreva sua mensagem..."
                  class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500" />
                <button type="submit"
                  class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition">
                  Enviar
                </button>
              </form>
            </div>
          } @else {
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
              Selecione um orçamento ao lado para abrir o chat ou acessar os contatos.
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class QuotesComponent {
  service = inject(SupabaseMarketplaceService);

  selectedQuoteId = signal<string>('');
  newMessage = '';

  selectedQuote = computed<QuoteRequest | undefined>(() => {
    const id = this.selectedQuoteId();
    const list = this.service.quotes();
    return list.find(q => q.id === id) ?? list[0];
  });

  activeMessages = computed(() => {
    const q = this.selectedQuote();
    if (!q) return [];
    return this.service.messages().filter(m => m.quoteId === q.id);
  });

  send(): void {
    const q = this.selectedQuote();
    if (!q || !this.newMessage.trim()) return;

    if (!this.service.currentUser()) {
      this.service.loginDemo('CLIENT');
    }

    this.service.sendMessage(q.id, this.newMessage);
    this.newMessage = '';
  }
}
