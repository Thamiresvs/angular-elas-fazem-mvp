import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SupabaseMarketplaceService } from './core/services/supabase-marketplace.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Navbar -->
      <header class="bg-white border-b border-purple-100 sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a routerLink="/discover" class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-rose-500 text-white font-bold flex items-center justify-center text-sm">
              EF
            </span>
            <span class="font-extrabold text-lg tracking-tight text-slate-900">
              Elas<span class="text-purple-600">Fazem</span>
            </span>
          </a>

          <nav class="flex items-center gap-6 text-sm font-medium">
            <a routerLink="/discover" routerLinkActive="text-purple-700 font-bold"
              class="text-slate-600 hover:text-purple-700 transition">
              Explorar Serviços
            </a>
            <a routerLink="/quotes" routerLinkActive="text-purple-700 font-bold"
              class="text-slate-600 hover:text-purple-700 transition">
              Orçamentos & Chat
            </a>

            @if (service.currentUser(); as user) {
              <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div class="text-right hidden sm:block">
                  <p class="text-xs font-bold text-slate-800">{{ user.fullName }}</p>
                  <p class="text-[11px] text-purple-600 font-medium">
                    {{ user.role === 'PROVIDER' ? 'Prestadora' : 'Cliente' }}
                  </p>
                </div>
                <button (click)="service.logout()" class="text-xs text-rose-600 hover:underline font-medium">
                  Sair
                </button>
              </div>
            } @else {
              <a routerLink="/auth"
                class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition">
                Cadastrar / Entrar
              </a>
            }
          </nav>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Elas Fazem MVP — Angular, TypeScript, Tailwind CSS & Supabase
      </footer>
    </div>
  `
})
export class AppComponent {
  service = inject(SupabaseMarketplaceService);
}
