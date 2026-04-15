import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { SnackbarEffects } from './snackbar.effects';
import {
  salvarUsuarioSuccess,
  salvarUsuarioError,
  deletarUsuarioSuccess,
  deletarUsuarioError,
  loadUsuariosError,
} from './usuarios.actions';
import { Usuario } from '../models/usuario.model';

const mockUsuario: Usuario = {
  id: '1', nome: 'Ana Silva', email: 'ana@e.com',
  cpf: '111', telefone: '111', tipoTelefone: 'celular',
};

describe('SnackbarEffects', () => {
  let actions$: Observable<Action>;
  let effects: SnackbarEffects;
  let snackBar: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SnackbarEffects,
        provideMockActions(() => actions$),
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ],
    });
    effects  = TestBed.inject(SnackbarEffects);
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
  });

  const expectSnack = (msg: string, classe: string) =>
    expect(snackBar.open).toHaveBeenCalledWith(
      msg, 'Fechar',
      expect.objectContaining({ panelClass: [classe] })
    );

  it('salvarSucesso$: exibe snack-sucesso com nome', (done) => {
    actions$ = of(salvarUsuarioSuccess({ usuario: mockUsuario }));
    effects.salvarSucesso$.subscribe(() => {
      expectSnack('✅ Ana Silva salvo com sucesso!', 'snack-sucesso');
      done();
    });
  });

  it('salvarErro$: exibe snack-erro', (done) => {
    actions$ = of(salvarUsuarioError({ erro: 'Timeout' }));
    effects.salvarErro$.subscribe(() => {
      expectSnack('❌ Erro ao salvar: Timeout', 'snack-erro');
      done();
    });
  });

  it('deletarSucesso$: exibe snack-sucesso', (done) => {
    actions$ = of(deletarUsuarioSuccess({ id: '1' }));
    effects.deletarSucesso$.subscribe(() => {
      expectSnack('🗑️ Usuário excluído com sucesso!', 'snack-sucesso');
      done();
    });
  });

  it('deletarErro$: exibe snack-erro', (done) => {
    actions$ = of(deletarUsuarioError({ id: '1', erro: 'Falha' }));
    effects.deletarErro$.subscribe(() => {
      expectSnack('❌ Erro ao excluir: Falha', 'snack-erro');
      done();
    });
  });

  it('loadErro$: exibe snack-erro com mensagem', (done) => {
    actions$ = of(loadUsuariosError({ erro: 'Erro de rede' }));
    effects.loadErro$.subscribe(() => {
      expectSnack('Erro de rede', 'snack-erro');
      done();
    });
  });
});
