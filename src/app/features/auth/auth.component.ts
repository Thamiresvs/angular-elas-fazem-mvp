import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseMarketplaceService } from '../../core/services/supabase-marketplace.service';
import { UserRole } from '../../core/models/marketplace.models';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4">
      <div class="bg-white rounded-2xl border border-purple-100 shadow-sm p-8">
        <div class="text-center mb-8">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 mb-2">
            Comunidade Segura & Colaborativa
          </span>
          <h1 class="text-2xl font-bold text-slate-900">Crie sua conta no Elas Fazem</h1>
          <p class="text-sm text-slate-500 mt-1">Escolha seu perfil de acesso para contratar ou oferecer serviços</p>
        </div>

        <!-- Seletor de Perfil Distinto -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <button type="button" (click)="selectedRole.set('CLIENT')"
            class="p-4 rounded-xl border-2 text-left transition"
            [ngClass]="selectedRole() === 'CLIENT' ? 'border-rose-500 bg-rose-50/70' : 'border-slate-200 hover:border-slate-300'">
            <p class="font-bold text-slate-900">Sou Cliente</p>
            <p class="text-xs text-slate-500 mt-1">Quero encontrar profissionais mulheres e pedir orçamentos</p>
          </button>

          <button type="button" (click)="selectedRole.set('PROVIDER')"
            class="p-4 rounded-xl border-2 text-left transition"
            [ngClass]="selectedRole() === 'PROVIDER' ? 'border-purple-600 bg-purple-50/70' : 'border-slate-200 hover:border-slate-300'">
            <p class="font-bold text-slate-900">Sou Prestadora</p>
            <p class="text-xs text-slate-500 mt-1">Quero divulgar meus serviços, WhatsApp, Instagram e receber pedidos</p>
          </button>
        </div>

        <form (ngSubmit)="onRegister()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
              <input [(ngModel)]="fullName" name="fullName" required placeholder="Ex: Ana Paula Silva"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail *</label>
              <input [(ngModel)]="email" name="email" type="email" required placeholder="ana@email.com"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-purple-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Telefone (com DDD) *</label>
              <input [(ngModel)]="phone" name="phone" required placeholder="5521999998888"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Cidade / Estado *</label>
              <input [(ngModel)]="city" name="city" required placeholder="Ex: Rio de Janeiro, RJ"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-purple-500" />
            </div>
          </div>

          <!-- Campos exclusivos para Prestadora de Serviços -->
          @if (selectedRole() === 'PROVIDER') {
            <div class="pt-4 border-t border-slate-100 space-y-4">
              <p class="text-xs font-bold uppercase tracking-wider text-purple-700">Dados Profissionais da Prestadora</p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Categoria de Serviço *</label>
                  <select [(ngModel)]="category" name="category" required
                    class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white">
                    <option value="Manutenção & Elétrica">Manutenção & Elétrica</option>
                    <option value="Marcenaria & Montagem">Marcenaria & Montagem</option>
                    <option value="Design & Social Media">Design & Social Media</option>
                    <option value="Suporte Técnico & TI">Suporte Técnico & TI</option>
                    <option value="Beleza & Bem-estar">Beleza & Bem-estar</option>
                    <option value="Consultoria & Aulas">Consultoria & Aulas</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Valor Hora / Base (R$) *</label>
                  <input type="number" [(ngModel)]="hourlyRate" name="hourlyRate" min="20" required
                    class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Instagram Profissional *</label>
                  <input [(ngModel)]="instagram" name="instagram" required placeholder="@seu.perfil"
                    class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição dos Serviços *</label>
                <textarea [(ngModel)]="bio" name="bio" rows="3" required
                  placeholder="Conte sua experiência, especialidades e regiões de atendimento..."
                  class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"></textarea>
              </div>
            </div>
          }

          <button type="submit"
            class="w-full py-3 rounded-xl font-semibold text-white text-sm transition shadow-sm"
            [ngClass]="selectedRole() === 'PROVIDER' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-rose-600 hover:bg-rose-700'">
            {{ selectedRole() === 'PROVIDER' ? 'Cadastrar como Prestadora de Serviços' : 'Cadastrar como Cliente' }}
          </button>
        </form>

        <!-- Acesso rápido para testar ambos os perfis -->
        <div class="mt-6 pt-6 border-t border-slate-100 text-center">
          <p class="text-xs text-slate-400 mb-3">Acesso instantâneo para demonstração:</p>
          <div class="flex flex-wrap justify-center gap-3">
            <button type="button" (click)="quickLogin('CLIENT')"
              class="px-4 py-2 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 transition">
              Entrar como Cliente Demo
            </button>
            <button type="button" (click)="quickLogin('PROVIDER')"
              class="px-4 py-2 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition">
              Entrar como Prestadora Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  private service = inject(SupabaseMarketplaceService);
  private router = inject(Router);

  selectedRole = signal<UserRole>('CLIENT');

  fullName = '';
  email = '';
  phone = '';
  city = '';
  category = 'Manutenção & Elétrica';
  hourlyRate = 100;
  instagram = '';
  bio = '';

  async onRegister(): Promise<void> {
    if (!this.fullName || !this.email || !this.phone || !this.city) return;

    await this.service.registerUser({
      role: this.selectedRole(),
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      city: this.city,
      ...(this.selectedRole() === 'PROVIDER' ? {
        category: this.category,
        hourlyRate: this.hourlyRate,
        instagram: this.instagram,
        bio: this.bio
      } : {})
    });

    this.router.navigate([this.selectedRole() === 'PROVIDER' ? '/quotes' : '/discover']);
  }

  quickLogin(role: UserRole): void {
    this.service.loginDemo(role);
    this.router.navigate([role === 'PROVIDER' ? '/quotes' : '/discover']);
  }
}
