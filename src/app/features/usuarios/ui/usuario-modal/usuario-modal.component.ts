import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
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
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuario-modal-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatDialogModule, MatButtonModule, MatIconModule, UsuarioFormComponent],
  template: `
    <div mat-dialog-title class="modal-header">
      <span>{{ data.usuarioEdicao ? 'Editar Usuário' : 'Novo Usuário' }}</span>
      <button mat-icon-button (click)="fechar()" aria-label="Fechar modal">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <app-usuario-form
        [usuarioEdicao]="data.usuarioEdicao"
        [salvando]="data.salvando"
        (submeterForm)="salvar($event)"
        (cancelar)="fechar()"
      />
    </mat-dialog-content>
  `,
  styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 0;
    }
    mat-dialog-content { min-width: min(480px, 90vw); padding-top: 8px; }
  `],
})
export class UsuarioModalDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UsuarioModalDialogComponent>);
  readonly data: { usuarioEdicao: Usuario | null; salvando: boolean } =
    inject(MatDialogModule) as any;

  constructor() {
    const ref = inject(MatDialogRef<UsuarioModalDialogComponent>);
    this.dialogRef = ref;
  }

  salvar(payload: Omit<Usuario, 'id'> | Usuario): void {
    this.dialogRef.close({ action: 'salvar', payload });
  }

  fechar(): void {
    this.dialogRef.close({ action: 'cancelar' });
  }
}

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatDialogModule, UsuarioFormComponent, MatButtonModule, MatIconModule],
  template: `
    <ng-container>
      <div [class.modal-overlay]="modalAberto$ | async">
        @if (modalAberto$ | async) {
          <div class="modal-backdrop" (click)="fechar()"></div>
          <div class="modal-container" role="dialog" aria-modal="true">
            <div class="modal-header">
              <h2>{{ (usuarioEdicao$ | async) ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
              <button mat-icon-button (click)="fechar()" aria-label="Fechar">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="modal-body">
              <app-usuario-form
                [usuarioEdicao]="usuarioEdicao$ | async"
                [salvando]="(salvando$ | async) ?? false"
                (submeterForm)="salvar($event)"
                (cancelar)="fechar()"
              />
            </div>
          </div>
        }
      </div>
    </ng-container>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      display: flex; align-items: center; justify-content: center;
    }
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.48);
    }
    .modal-container {
      position: relative; z-index: 1001;
      background: #fff;
      border-radius: 12px;
      width: min(520px, 95vw);
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      overflow: hidden;
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 16px 8px 24px;
      border-bottom: 1px solid #eee;
      h2 { font-size: 1.2rem; font-weight: 500; }
    }
    .modal-body { padding: 16px 24px 24px; }
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

  salvar(payload: Omit<Usuario, 'id'> | Usuario): void {
    this.store.dispatch(salvarUsuario({ usuario: payload }));
  }
}
