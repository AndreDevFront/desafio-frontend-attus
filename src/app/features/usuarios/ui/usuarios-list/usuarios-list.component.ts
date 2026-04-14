import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  selectUsuariosFiltrados,
  selectLoading,
} from '../../data-access/store/usuarios.selectors';
import { setFiltroNome } from '../../data-access/store/usuarios.actions';
import { UsuarioCardComponent } from '../usuario-card/usuario-card.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    UsuarioCardComponent,
  ],
  template: `
    <!-- Barra de busca + contador -->
    <div class="list-toolbar">
      <mat-form-field appearance="outline" class="campo-busca">
        <mat-label>Buscar usuário</mat-label>
        <mat-icon matPrefix class="search-icon">search</mat-icon>
        <input matInput [formControl]="campoBusca" placeholder="Digite o nome..." />
      </mat-form-field>

      @if (usuarios$ | async; as usuarios) {
        <span class="contador">
          {{ usuarios.length }} {{ usuarios.length === 1 ? 'usuário' : 'usuários' }}
        </span>
      }
    </div>

    <!-- Skeleton loading -->
    @if (loading$ | async) {
      <div class="skeleton-grid">
        @for (i of skeletons; track i) {
          <div class="skeleton-card">
            <div class="sk sk-avatar"></div>
            <div class="sk-info">
              <div class="sk sk-title"></div>
              <div class="sk sk-sub"></div>
            </div>
          </div>
        }
      </div>
    }

    <!-- Lista de cards -->
    @if (usuarios$ | async; as usuarios) {
      @if (!(loading$ | async)) {
        @if (usuarios.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">
              <mat-icon>group_off</mat-icon>
            </div>
            <h3>Nenhum usuário encontrado</h3>
            <p>Tente ajustar o filtro ou cadastre um novo usuário.</p>
          </div>
        } @else {
          <div class="usuarios-grid">
            @for (usuario of usuarios; track usuario.id) {
              <app-usuario-card [usuario]="usuario" />
            }
          </div>
        }
      }
    }
  `,
  styles: [`
    /* Toolbar */
    .list-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .campo-busca {
      flex: 1;
      min-width: 220px;
      background: #fff;
      border-radius: 12px;
      .search-icon { color: #9e9e9e; margin-right: 4px; }
    }
    .contador {
      font-size: 0.85rem;
      color: var(--color-muted);
      white-space: nowrap;
      font-weight: 500;
      background: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--color-border);
    }

    /* Grid */
    .usuarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
      gap: 16px;
    }

    /* Skeleton */
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
      gap: 16px;
    }
    .skeleton-card {
      background: #fff;
      border-radius: var(--radius-card);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-card);
    }
    .sk-info { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .sk {
      border-radius: 8px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }
    .sk-avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
    .sk-title  { height: 16px; width: 60%; }
    .sk-sub    { height: 13px; width: 80%; }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 80px 24px;
      color: var(--color-muted);
      gap: 12px;
    }
    .empty-icon {
      width: 72px;
      height: 72px;
      background: #ede7f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      mat-icon { font-size: 36px; width: 36px; height: 36px; color: #7e57c2; }
    }
    .empty-state h3 { font-size: 1.1rem; font-weight: 600; color: #333; }
    .empty-state p  { font-size: 0.9rem; max-width: 36ch; }
  `],
})
export class UsuariosListComponent {
  private readonly store = inject(Store);

  readonly campoBusca = new FormControl('');
  readonly usuarios$  = this.store.select(selectUsuariosFiltrados);
  readonly loading$   = this.store.select(selectLoading);
  readonly skeletons  = [1, 2, 3, 4, 5, 6];

  constructor() {
    this.campoBusca.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe((filtro) => {
      this.store.dispatch(setFiltroNome({ filtro: filtro ?? '' }));
    });
  }
}
