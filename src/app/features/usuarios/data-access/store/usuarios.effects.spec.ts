import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { UsuariosEffects } from './usuarios.effects';
import { UsuariosService } from '../services/usuarios.service';
import {
  loadUsuarios,
  loadUsuariosSuccess,
  loadUsuariosError,
  salvarUsuario,
  salvarUsuarioSuccess,
  salvarUsuarioError,
} from './usuarios.actions';
import { Usuario } from '../models/usuario.model';

const mockUsuario: Usuario = {
  id: '1',
  nome: 'Ana Silva',
  email: 'ana@email.com',
  cpf: '12345678900',
  telefone: '54999990001',
  tipoTelefone: 'celular',
};

describe('UsuariosEffects', () => {
  let actions$: Observable<Action>;
  let effects: UsuariosEffects;
  let service: jest.Mocked<UsuariosService>;

  beforeEach(() => {
    const serviceMock = {
      listar:    jest.fn(),
      salvar:    jest.fn(),
      atualizar: jest.fn(),
      excluir:   jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UsuariosEffects,
        provideMockActions(() => actions$),
        { provide: UsuariosService, useValue: serviceMock },
      ],
    });

    effects = TestBed.inject(UsuariosEffects);
    service = TestBed.inject(UsuariosService) as jest.Mocked<UsuariosService>;
  });

  describe('loadUsuarios$', () => {
    it('deve emitir loadUsuariosSuccess quando service.listar() retorna dados', (done) => {
      service.listar.mockReturnValue(of([mockUsuario]));
      actions$ = of(loadUsuarios());

      effects.loadUsuarios$.subscribe((action) => {
        expect(action).toEqual(loadUsuariosSuccess({ usuarios: [mockUsuario] }));
        done();
      });
    });

    it('deve emitir loadUsuariosError quando service.listar() falha', (done) => {
      service.listar.mockReturnValue(throwError(() => new Error('Falha na rede')));
      actions$ = of(loadUsuarios());

      effects.loadUsuarios$.subscribe((action) => {
        expect(action).toEqual(loadUsuariosError({ erro: 'Falha na rede' }));
        done();
      });
    });
  });

  describe('salvarUsuario$', () => {
    it('deve emitir salvarUsuarioSuccess ao criar novo usuário (sem id)', (done) => {
      const payload: Omit<Usuario, 'id'> = {
        nome: 'Novo User',
        email: 'novo@email.com',
        cpf: '98765432100',
        telefone: '54988880000',
        tipoTelefone: 'comercial',
      };
      service.salvar.mockReturnValue(of({ ...payload, id: 'novo-id' } as Usuario));
      actions$ = of(salvarUsuario({ usuario: payload }));

      effects.salvarUsuario$.subscribe((action) => {
        expect(action.type).toBe(salvarUsuarioSuccess.type);
        done();
      });
    });

    it('deve emitir salvarUsuarioSuccess ao atualizar usuário existente (com id)', (done) => {
      service.atualizar.mockReturnValue(of(mockUsuario));
      actions$ = of(salvarUsuario({ usuario: mockUsuario }));

      effects.salvarUsuario$.subscribe((action) => {
        expect(action).toEqual(salvarUsuarioSuccess({ usuario: mockUsuario }));
        done();
      });
    });

    it('deve emitir salvarUsuarioError quando a operação falha', (done) => {
      service.atualizar.mockReturnValue(throwError(() => new Error('Erro ao salvar')));
      actions$ = of(salvarUsuario({ usuario: mockUsuario }));

      effects.salvarUsuario$.subscribe((action) => {
        expect(action).toEqual(salvarUsuarioError({ erro: 'Erro ao salvar' }));
        done();
      });
    });
  });
});
