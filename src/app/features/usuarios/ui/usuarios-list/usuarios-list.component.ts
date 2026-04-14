import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  selectUsuariosPaginados,
  selectTotalFiltrados,
  selectLoading,
  selectPaginaAtual,
  selectTamanhoPagina,
} from '../../data-access/store/usuarios.selectors';
import { setFiltroNome, setPagina, setTamanhoPagina } from '../../data-access/store/usuarios.actions';
import { UsuarioCardComponent } from '../usuario-card/usuario-card.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    UsuarioCardComponent,
  ],
  template: `
    <!-- Barra de busca + contador -->
    <div class="list-toolbar">
      <div class="search-wrapper">
        <mat-icon class="search-icon">search</mat-icon>
        <input
          class="search-input"
          [formControl]="campoBusca"
          placeholder="Buscar usuário por nome..."
          aria-label="Buscar usuário"
        />
      </div>

      @if (total$ | async; as total) {
        <span class="contador">
          {{ total }} {{ total === 1 ? 'usuário' : 'usuários' }}
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
    @if (!(loading$ | async)) {
      @if ((total$ | async) === 0) {
        <div class="empty-state">
          <div class="empty-icon">
            <mat-icon>group_off</mat-icon>
          </div>
          <h3>Nenhum usuário encontrado</h3>
          <p>Tente ajustar o filtro ou cadastre um novo usuário.</p>
        </div>
      } @else {
        <div class="usuarios-grid">
          @for (usuario of usuarios$ | async; track usuario.id) {
            <app-usuario-card [usuario]="usuario" />
          }
        </div>

        <!-- Paginador -->
        <mat-paginator
          [length]="total$ | async"
          [pageSize]="tamanhoPagina$ | async"
          [pageIndex]="pagina$ | async"
          [pageSizeOptions]="[6, 12, 24]"
          (page)="onPage($event)"
          aria-label="Paginação de usuários"
        />
      }
    }
  `,
  styles: [`
    .list-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .search-wrapper {
      flex: 1;
      min-width: 220px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fff;
      border: 1.5px solid #e0e0e0;
      border-radius: 14px;
      padding: 0 16px;
      height: 48px;
      transition: border-color 180ms, box-shadow 180ms;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      &:focus-within {
        border-color: #3949ab;
        box-shadow: 0 0 0 3px rgba(57,73,171,0.10);
      }
    }
    .search-icon { color: #9e9e9e; font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }
    .search-input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 0.92rem; font-family: 'Roboto', sans-serif;
      &::placeholder { color: #aaa; }
    }
    .contador {
      font-size: 0.85rem; font-weight: 500; white-space: nowrap;
      background: #fff; padding: 6px 14px;
      border-radius: 20px; border: 1px solid #e0e0e0;
      color: #757575;
    }
    .usuarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
      gap: 16px;
    }
    mat-paginator {
      margin-top: 24px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    /* Skeleton */
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
      gap: 16px;
    }
    .skeleton-card {
      background: #fff; border-radius: 14px; padding: 20px;
      display: flex; align-items: center; gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
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
      display: flex; flex-direction: column; align-items: center;
      text-align: center; padding: 80px 24px; color: #9e9e9e; gap: 12px;
    }
    .empty-icon {
      width: 72px; height: 72px; background: #ede7f6;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      margin-bottom: 8px;
      mat-icon { font-size: 36px; width: 36px; height: 36px; color: #7e57c2; }
    }
    .empty-state h3 { font-size: 1.1rem; font-weight: 600; color: #333; }
    .empty-state p  { font-size: 0.9rem; max-width: 36ch; }
  `],
})
export class UsuariosListComponent {
  private readonly store = inject(Store);

  readonly campoBusca    = new FormControl('');
  readonly usuarios$     = this.store.select(selectUsuariosPaginados);
  readonly total$        = this.store.select(selectTotalFiltrados);
  readonly loading$      = this.store.select(selectLoading);
  readonly pagina$       = this.store.select(selectPaginaAtual);
  readonly tamanhoPagina$ = this.store.select(selectTamanhoPagina);
  readonly skeletons     = [1, 2, 3, 4, 5, 6];

  constructor() {
    this.campoBusca.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe((filtro) =>
      this.store.dispatch(setFiltroNome({ filtro: filtro ?? '' }))
    );
  }

  onPage(event: PageEvent): void {
    if (event.pageSize !== (this.store as any)) {
      this.store.dispatch(setTamanhoPagina({ tamanho: event.pageSize }));
    }
    this.store.dispatch(setPagina({ pagina: event.pageIndex }));
  }
}
