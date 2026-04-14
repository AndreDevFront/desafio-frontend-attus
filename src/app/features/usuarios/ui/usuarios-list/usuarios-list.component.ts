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
    <!-- Campo de filtro -->
    <mat-form-field appearance="outline" class="campo-busca">
      <mat-label>Buscar por nome</mat-label>
      <input matInput [formControl]="campoBusca" placeholder="Digite o nome..." />
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>

    <!-- Loading -->
    @if (loading$ | async) {
      <div class="loading-wrapper">
        <mat-spinner diameter="48" />
        <p>Carregando usuários...</p>
      </div>
    }

    <!-- Lista de cards -->
    @if (!(loading$ | async)) {
      <ng-container *ngIf="usuarios$ | async as usuarios">
        @if (usuarios.length === 0) {
          <div class="empty-state">
            <mat-icon>group_off</mat-icon>
            <p>Nenhum usuário encontrado.</p>
          </div>
        } @else {
          <div class="usuarios-grid">
            @for (usuario of usuarios; track usuario.id) {
              <app-usuario-card [usuario]="usuario" />
            }
          </div>
        }
      </ng-container>
    }
  `,
  styles: [`
    .campo-busca { width: 100%; margin-bottom: 24px; }
    .loading-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 48px 0;
      color: #666;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 64px 0;
      color: #999;
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
    }
    .usuarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
      gap: 16px;
    }
  `],
})
export class UsuariosListComponent {
  private readonly store = inject(Store);

  readonly campoBusca = new FormControl('');
  readonly usuarios$  = this.store.select(selectUsuariosFiltrados);
  readonly loading$   = this.store.select(selectLoading);

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
