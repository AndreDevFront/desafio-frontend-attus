import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import {
  loadUsuarios,
  abrirModalUsuario,
  salvarUsuarioSuccess,
  salvarUsuarioError,
  deletarUsuarioSuccess,
  deletarUsuarioError,
} from '../data-access/store/usuarios.actions';
import { selectErro } from '../data-access/store/usuarios.selectors';
import { UsuariosListComponent } from '../ui/usuarios-list/usuarios-list.component';
import { UsuarioModalComponent } from '../ui/usuario-modal/usuario-modal.component';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    UsuariosListComponent,
    UsuarioModalComponent,
  ],
  templateUrl: './usuarios-page.component.html',
  styleUrl: './usuarios-page.component.scss',
})
export class UsuariosPageComponent implements OnInit {
  private readonly store    = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    // Erros via selector (load)
    this.store.select(selectErro).pipe(
      filter(Boolean),
      takeUntilDestroyed()
    ).subscribe((erro) =>
      this.snack(erro, 'snack-erro')
    );

    // Sucesso: salvar
    this.actions$.pipe(
      ofType(salvarUsuarioSuccess),
      takeUntilDestroyed()
    ).subscribe(({ usuario }) => {
      const msg = usuario.nome
        ? `✅ ${usuario.nome} salvo com sucesso!`
        : '✅ Usuário salvo com sucesso!';
      this.snack(msg, 'snack-sucesso');
    });

    // Erro: salvar
    this.actions$.pipe(
      ofType(salvarUsuarioError),
      takeUntilDestroyed()
    ).subscribe(({ erro }) =>
      this.snack(`❌ Erro ao salvar: ${erro}`, 'snack-erro')
    );

    // Sucesso: deletar
    this.actions$.pipe(
      ofType(deletarUsuarioSuccess),
      takeUntilDestroyed()
    ).subscribe(() =>
      this.snack('🗑️ Usuário excluído com sucesso!', 'snack-sucesso')
    );

    // Erro: deletar
    this.actions$.pipe(
      ofType(deletarUsuarioError),
      takeUntilDestroyed()
    ).subscribe(({ erro }) =>
      this.snack(`❌ Erro ao excluir: ${erro}`, 'snack-erro')
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsuarios());
  }

  abrirModalNovo(): void {
    this.store.dispatch(abrirModalUsuario({ usuario: null }));
  }

  private snack(mensagem: string, classe: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [classe],
    });
  }
}
