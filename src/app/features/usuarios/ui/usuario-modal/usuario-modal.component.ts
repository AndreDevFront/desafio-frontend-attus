import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  selectModalAberto,
  selectUsuarioEdicao,
  selectSalvando,
} from '../../data-access/store/usuarios.selectors';
import {
  fecharModalUsuario,
  salvarUsuario,
} from '../../data-access/store/usuarios.actions';
import { Usuario } from '../../data-access/models/usuario.model';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatButtonModule, MatIconModule, UsuarioFormComponent],
  template: `
    @if (modalAberto$ | async) {
      <div class="overlay" (click)="fecharBackdrop($event)" role="dialog" aria-modal="true">
        <div class="modal" (click)="$event.stopPropagation()">

          <!-- Header do modal -->
          <div class="modal-header">
            <div class="modal-header-icon">
              <mat-icon>{{ (usuarioEdicao$ | async) ? 'edit' : 'person_add' }}</mat-icon>
            </div>
            <div>
              <h2 class="modal-title">
                {{ (usuarioEdicao$ | async) ? 'Editar Usuário' : 'Novo Usuário' }}
              </h2>
              <p class="modal-sub">
                {{ (usuarioEdicao$ | async) ? 'Atualize os dados do cadastro' : 'Preencha os dados para cadastrar' }}
              </p>
            </div>
            <button
              mat-icon-button
              class="btn-fechar"
              (click)="fechar()"
              aria-label="Fechar modal"
            >
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Divider -->
          <div class="modal-divider"></div>

          <!-- Body -->
          <div class="modal-body">
            <app-usuario-form
              [usuarioEdicao]="usuarioEdicao$ | async"
              [salvando]="(salvando$ | async) ?? false"
              (submeterForm)="salvar($event)"
              (cancelar)="fechar()"
            />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(10,10,30,0.5);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: fadeIn 180ms ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .modal {
      background: #fff;
      border-radius: var(--radius-modal);
      width: min(540px, 100%);
      box-shadow: var(--shadow-modal);
      overflow: hidden;
      animation: slideUp 220ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp {
      from { transform: translateY(24px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }

    /* Header */
    .modal-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px 20px 16px 24px;
    }
    .modal-header-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3949ab, #5c6bc0);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { color: #fff; font-size: 22px; }
    }
    .modal-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text);
      line-height: 1.2;
    }
    .modal-sub {
      font-size: 0.78rem;
      color: var(--color-muted);
      margin-top: 2px;
    }
    .btn-fechar {
      margin-left: auto;
      color: var(--color-muted);
    }

    .modal-divider {
      height: 1px;
      background: #f0f0f0;
    }

    .modal-body {
      padding: 20px 24px 24px;
    }
  `],
})
export class UsuarioModalComponent {
  private readonly store = inject(Store);

  readonly modalAberto$   = this.store.select(selectModalAberto);
  readonly usuarioEdicao$ = this.store.select(selectUsuarioEdicao);
  readonly salvando$      = this.store.select(selectSalvando);

  fechar(): void {
    this.store.dispatch(fecharModalUsuario());
  }

  fecharBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.fechar();
    }
  }

  salvar(payload: Omit<Usuario, 'id'> | Usuario): void {
    this.store.dispatch(salvarUsuario({ usuario: payload }));
  }
}
