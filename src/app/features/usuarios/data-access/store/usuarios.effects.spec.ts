import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { UsuariosEffects } from './usuarios.effects';
import { UsuariosService } from '../services/usuarios.service';
import {
  loadUsuarios, loadUsuariosSuccess, loadUsuariosError,
  salvarUsuario, salvarUsuarioSuccess, salvarUsuarioError,
  deletarUsuario, deletarUsuarioSuccess, deletarUsuarioError,
} from './usuarios.actions';
import { Usuario } from '../models/usuario.model';

const mockUsuario: Usuario = {
  id: '1', nome: 'Ana Silva', email: 'ana@email.com',
  cpf: '12345678900', telefone: '54999990001', tipoTelefone: 'celular',
};

describe('UsuariosEffects', () => {
  let actions$: Observable<Action>;
  let effects: UsuariosEffects;
  let service: jest.Mocked<UsuariosService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsuariosEffects,
        provideMockActions(() => actions$),
        {
          provide: UsuariosService,
          useValue: { listar: jest.fn(), salvar: jest.fn(), atualizar: jest.fn(), excluir: jest.fn() },
        },
      ],
    });
    effects = TestBed.inject(UsuariosEffects);
    service = TestBed.inject(UsuariosService) as jest.Mocked<UsuariosService>;
  });

  // --- loadUsuarios$ ---
  describe('loadUsuarios$', () => {
    it('emite loadUsuariosSuccess com dados', (done) => {
      service.listar.mockReturnValue(of([mockUsuario]));
      actions$ = of(loadUsuarios());
      effects.loadUsuarios$.subscribe((action) => {
        expect(action).toEqual(loadUsuariosSuccess({ usuarios: [mockUsuario] }));
        done();
      });
    });

    it('emite loadUsuariosError com message do erro', (done) => {
      service.listar.mockReturnValue(throwError(() => new Error('Falha na rede')));
      actions$ = of(loadUsuarios());
      effects.loadUsuarios$.subscribe((action) => {
        expect(action).toEqual(loadUsuariosError({ erro: 'Falha na rede' }));
        done();
      });
    });

    it('usa mensagem padrão quando erro não tem .message', (done) => {
      service.listar.mockReturnValue(throwError(() => ({})));
      actions$ = of(loadUsuarios());
      effects.loadUsuarios$.subscribe((action) => {
        expect(action).toEqual(loadUsuariosError({ erro: 'Erro ao carregar usuários' }));
        done();
      });
    });
  });

  // --- salvarUsuario$ ---
  describe('salvarUsuario$', () => {
    it('chama service.salvar e emite salvarUsuarioSuccess (sem id)', (done) => {
      const semId = { nome: 'X', email: 'x@x.com', cpf: '000', telefone: '000', tipoTelefone: 'celular' as const };
      service.salvar.mockReturnValue(of({ ...semId, id: 'novo' }));
      actions$ = of(salvarUsuario({ usuario: semId }));
      effects.salvarUsuario$.subscribe((action) => {
        expect(service.salvar).toHaveBeenCalled();
        expect(action.type).toBe(salvarUsuarioSuccess.type);
        done();
      });
    });

    it('chama service.atualizar e emite salvarUsuarioSuccess (com id)', (done) => {
      service.atualizar.mockReturnValue(of(mockUsuario));
      actions$ = of(salvarUsuario({ usuario: mockUsuario }));
      effects.salvarUsuario$.subscribe((action) => {
        expect(action).toEqual(salvarUsuarioSuccess({ usuario: mockUsuario }));
        done();
      });
    });

    it('emite salvarUsuarioError com message do erro', (done) => {
      service.atualizar.mockReturnValue(throwError(() => new Error('Erro ao salvar')));
      actions$ = of(salvarUsuario({ usuario: mockUsuario }));
      effects.salvarUsuario$.subscribe((action) => {
        expect(action).toEqual(salvarUsuarioError({ erro: 'Erro ao salvar' }));
        done();
      });
    });

    it('usa mensagem padrão quando erro de salvar não tem .message', (done) => {
      service.atualizar.mockReturnValue(throwError(() => ({})));
      actions$ = of(salvarUsuario({ usuario: mockUsuario }));
      effects.salvarUsuario$.subscribe((action) => {
        expect(action).toEqual(salvarUsuarioError({ erro: 'Erro ao salvar usuário' }));
        done();
      });
    });
  });

  // --- deletarUsuario$ ---
  describe('deletarUsuario$', () => {
    it('chama service.excluir e emite deletarUsuarioSuccess', (done) => {
      service.excluir.mockReturnValue(of('1'));
      actions$ = of(deletarUsuario({ id: '1' }));
      effects.deletarUsuario$.subscribe((action) => {
        expect(service.excluir).toHaveBeenCalledWith('1');
        expect(action).toEqual(deletarUsuarioSuccess({ id: '1' }));
        done();
      });
    });

    it('emite deletarUsuarioError com message do erro', (done) => {
      service.excluir.mockReturnValue(throwError(() => new Error('Timeout')));
      actions$ = of(deletarUsuario({ id: '1' }));
      effects.deletarUsuario$.subscribe((action) => {
        expect(action).toEqual(deletarUsuarioError({ id: '1', erro: 'Timeout' }));
        done();
      });
    });

    it('usa mensagem padrão quando erro de deletar não tem .message', (done) => {
      service.excluir.mockReturnValue(throwError(() => ({})));
      actions$ = of(deletarUsuario({ id: '1' }));
      effects.deletarUsuario$.subscribe((action) => {
        expect(action).toEqual(deletarUsuarioError({ id: '1', erro: 'Erro ao deletar usuário' }));
        done();
      });
    });
  });
});
