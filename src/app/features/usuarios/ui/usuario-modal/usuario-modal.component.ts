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
  templateUrl: './usuario-modal.component.html',
  styleUrl: './usuario-modal.component.scss',
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
