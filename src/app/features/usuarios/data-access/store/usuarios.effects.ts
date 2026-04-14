import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { UsuariosService } from '../services/usuarios.service';
import {
  loadUsuarios, loadUsuariosSuccess, loadUsuariosError,
  salvarUsuario, salvarUsuarioSuccess, salvarUsuarioError,
} from './usuarios.actions';
import { Usuario } from '../models/usuario.model';

@Injectable()
export class UsuariosEffects {
  private readonly actions$ = inject(Actions);
  private readonly service  = inject(UsuariosService);

  loadUsuarios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsuarios),
      switchMap(() =>
        this.service.listar().pipe(
          map((usuarios) => loadUsuariosSuccess({ usuarios })),
          catchError((err)  => of(loadUsuariosError({ erro: err.message ?? 'Erro ao carregar usuários' })))
        )
      )
    )
  );

  salvarUsuario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(salvarUsuario),
      switchMap(({ usuario }) => {
        const operacao$ = 'id' in usuario && (usuario as Usuario).id
          ? this.service.atualizar(usuario as Usuario)
          : this.service.salvar(usuario);

        return operacao$.pipe(
          map((salvo) => salvarUsuarioSuccess({ usuario: salvo })),
          catchError((err) => of(salvarUsuarioError({ erro: err.message ?? 'Erro ao salvar usuário' })))
        );
      })
    )
  );
}
