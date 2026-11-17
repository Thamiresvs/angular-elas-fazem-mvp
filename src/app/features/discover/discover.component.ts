import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseMarketplaceService } from '../../core/services/supabase-marketplace.service';
import { UserProfile } from '../../core/models/marketplace.models';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <!-- Hero Banner -->
      <section class="bg-gradient-to-r from-purple-700 via-purple-600 to-rose-500 rounded-3xl p-8 text-white shadow-md">
        <span class="text-xs uppercase tracking-widest font-semibold bg-white/20 px-3 py-1 rounded-full">
          Por mulheres, para mulheres
        </span>
        <h1 class="text-3xl md:text-4xl font-bold mt-3">Encontre prestadoras de serviço de confiança</h1>
        <p class="text-purple-100 mt-2 max-w-2xl text-sm md:text-base">
          Contrate profissionais verificadas, peça orçamentos na plataforma ou fale diretamente pelo WhatsApp e Instagram.
        </p>

        <!-- Barra de Busca & Filtro -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded-2xl text-slate-800 shadow-lg">
          <input [(ngModel)]="searchTerm" placeholder="Buscar por serviço, nome ou cidade..."
            class="px-4 py-2.5 rounded-xl bg-slate-50 text-sm focus:outline-none" />
          <select [(ngModel)]="selectedCategory" class="px-4 py-2.5 rounded-xl bg-slate-50 text-sm focus:outline-none">
            <option value="">Todas as categorias</option>
            <option value="Manutenção & Elétrica">Manutenção & Elétrica</option>
            <option value="Marcenaria & Montagem">Marcenaria & Montagem</option>
            <option value="Design & Social Media">Design & Social Media</option>
            <option value="Suporte Técnico & TI">Suporte Técnico & TI</option>
            <option value="Beleza & Bem-estar">Beleza & Bem-estar</option>
            <option value="Consultoria & Aulas">Consultoria & Aulas</option>
          </select>
          <div class="flex items-center justify-between px-4 py-2 text-xs text-slate-500">
            <span><strong>{{ filteredProviders().length }}</strong> profissionais disponíveis</span>
          </div>
        </div>
      </section>

      <!-- Grid de Prestadoras -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        @for (prov of filteredProviders(); track prov.id) {
          <div class="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl text-white font-bold flex items-center justify-center text-lg shrink-0"
                    [ngClass]="prov.avatarColor || 'bg-purple-600'">
                    {{ prov.fullName.charAt(0) }}
                  </div>
                  <div>
                    <h2 class="font-bold text-lg text-slate-900">{{ prov.fullName }}</h2>
                    <p class="text-xs font-medium text-purple-700">{{ prov.category }}</p>
                    <p class="text-xs text-slate-400 mt-0.5">{{ prov.city }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs text-slate-400 block">A partir de</span>
                  <span class="font-bold text-slate-800">{{ prov.hourlyRate | currency:'BRL' }}/h</span>
                </div>
              </div>

              <p class="text-sm text-slate-600 mt-4 leading-relaxed">{{ prov.bio }}</p>
            </div>

            <!-- Canais Diretos (WhatsApp + Instagram) + Orçamento -->
            <div class="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                @if (prov.phone) {
                  <a [href]="service.getWhatsAppUrl(prov.phone, prov.fullName)" target="_blank" rel="noopener"
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition">
                    WhatsApp
                  </a>
                }
                @if (prov.instagram) {
                  <a [href]="service.getInstagramUrl(prov.instagram)" target="_blank" rel="noopener"
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs font-semibold transition">
                    Instagram
                  </a>
                }
              </div>

              <button (click)="openQuoteModal(prov)"
                class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition">
                Solicitar Orçamento
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Modal de Solicitação de Orçamento -->
      @if (activeProvider()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-lg text-slate-900">Pedir Orçamento</h3>
              <button (click)="activeProvider.set(null)" class="text-slate-400 hover:text-slate-600 text-sm">Fechar</button>
            </div>

            <p class="text-xs text-slate-500">
              Para: <strong class="text-purple-700">{{ activeProvider()?.fullName }}</strong> ({{ activeProvider()?.category }})
            </p>

            <form (ngSubmit)="submitQuote()" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">O que você precisa?</label>
                <textarea [(ngModel)]="quoteDescription" name="desc" rows="3" required
                  placeholder="Descreva o serviço, local e detalhes importantes..."
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"></textarea>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Data desejada</label>
                <input type="date" [(ngModel)]="quoteDate" name="date" required
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm" />
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" (click)="activeProvider.set(null)"
                  class="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100">
                  Cancelar
                </button>
                <button type="submit"
                  class="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white">
                  Enviar Solicitação & Abrir Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class DiscoverComponent {
  service = inject(SupabaseMarketplaceService);
  private router = inject(Router);

  searchTerm = signal('');
  selectedCategory = signal('');

  activeProvider = signal<UserProfile | null>(null);
  quoteDescription = '';
  quoteDate = new Date().toISOString().split('T')[0];

  filteredProviders = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.service.providers().filter(p => {
      const matchesCat = !cat || p.category === cat;
      const matchesTerm = !term ||
        p.fullName.toLowerCase().includes(term) ||
        (p.category?.toLowerCase().includes(term) ?? false) ||
        p.city.toLowerCase().includes(term) ||
        (p.bio?.toLowerCase().includes(term) ?? false);
      return matchesCat && matchesTerm;
    });
  });

  openQuoteModal(provider: UserProfile): void {
    this.activeProvider.set(provider);
    this.quoteDescription = '';
  }

  async submitQuote(): Promise<void> {
    const prov = this.activeProvider();
    if (!prov || !this.quoteDescription.trim()) return;

    if (!this.service.currentUser()) {
      this.service.loginDemo('CLIENT');
    }

    await this.service.createQuote(prov, this.quoteDescription, this.quoteDate);
    this.activeProvider.set(null);
    this.router.navigate(['/quotes']);
  }
}
