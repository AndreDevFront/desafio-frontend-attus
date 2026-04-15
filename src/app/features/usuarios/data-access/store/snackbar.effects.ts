import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import {
  salvarUsuarioSuccess,
  salvarUsuarioError,
  deletarUsuarioSuccess,
  deletarUsuarioError,
  loadUsuariosError,
} from './usuarios.actions';

@Injectable()
export class SnackbarEffects {
  private readonly actions$ = inject(Actions);
  private readonly snackBar = inject(MatSnackBar);

  salvarSucesso$ = createEffect(() =>
    this.actions$.pipe(
      ofType(salvarUsuarioSuccess),
      tap(({ usuario }) => this.abrir(
        `✅ ${usuario.nome} salvo com sucesso!`,
        'snack-sucesso'
      ))
    ),
    { dispatch: false }
  );

  salvarErro$ = createEffect(() =>
    this.actions$.pipe(
      ofType(salvarUsuarioError),
      tap(({ erro }) => this.abrir(`❌ Erro ao salvar: ${erro}`, 'snack-erro'))
    ),
    { dispatch: false }
  );

  deletarSucesso$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletarUsuarioSuccess),
      tap(() => this.abrir('🗑️ Usuário excluído com sucesso!', 'snack-sucesso'))
    ),
    { dispatch: false }
  );

  deletarErro$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletarUsuarioError),
      tap(({ erro }) => this.abrir(`❌ Erro ao excluir: ${erro}`, 'snack-erro'))
    ),
    { dispatch: false }
  );

  loadErro$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsuariosError),
      tap(({ erro }) => this.abrir(erro, 'snack-erro'))
    ),
    { dispatch: false }
  );

  private abrir(mensagem: string, classe: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [classe],
    });
  }
}
