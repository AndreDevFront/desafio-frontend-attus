import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { Action } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosPageComponent } from './usuarios-page.component';
import {
  loadUsuarios,
  abrirModalUsuario,
  salvarUsuarioSuccess,
  salvarUsuarioError,
  deletarUsuarioSuccess,
  deletarUsuarioError,
} from '../data-access/store/usuarios.actions';
import { selectErro } from '../data-access/store/usuarios.selectors';
import {
  selectUsuariosPaginados,
  selectTotalFiltrados,
  selectLoading,
  selectPaginaAtual,
  selectTamanhoPagina,
  selectModalAberto,
  selectUsuarioEdicao,
  selectSalvando,
} from '../data-access/store/usuarios.selectors';
import { Usuario } from '../data-access/models/usuario.model';

const usuarioMock: Usuario = {
  id: '1', nome: 'Ana Silva', email: 'ana@email.com',
  cpf: '12345678900', telefone: '54999990001', tipoTelefone: 'celular',
};

describe('UsuariosPageComponent', () => {
  let fixture: ComponentFixture<UsuariosPageComponent>;
  let component: UsuariosPageComponent;
  let store: MockStore;
  let snackBar: jest.Mocked<MatSnackBar>;
  let actionsSubject: Subject<Action>;

  beforeEach(async () => {
    actionsSubject = new Subject<Action>();
    const snackMock = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [UsuariosPageComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectErro,               value: null  },
            { selector: selectModalAberto,        value: false },
            { selector: selectUsuarioEdicao,      value: null  },
            { selector: selectSalvando,           value: false },
            { selector: selectUsuariosPaginados,  value: []    },
            { selector: selectTotalFiltrados,     value: 0     },
            { selector: selectLoading,            value: false },
            { selector: selectPaginaAtual,        value: 0     },
            { selector: selectTamanhoPagina,      value: 6     },
          ],
        }),
        // Provê o token Actions como o mesmo Subject que usamos no teste
        { provide: Actions, useValue: actionsSubject },
        { provide: MatSnackBar, useValue: snackMock },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(UsuariosPageComponent);
    component = fixture.componentInstance;
    store     = TestBed.inject(MockStore);
    snackBar  = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve despachar loadUsuarios no ngOnInit', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatch).toHaveBeenCalledWith(loadUsuarios());
  });

  it('deve despachar abrirModalUsuario com null ao chamar abrirModalNovo()', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    component.abrirModalNovo();
    expect(dispatch).toHaveBeenCalledWith(abrirModalUsuario({ usuario: null }));
  });

  it('deve exibir snackbar de erro quando selectErro emitir valor', () => {
    store.overrideSelector(selectErro, 'Erro de rede');
    store.refreshState();
    fixture.detectChanges();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro de rede', 'Fechar',
      expect.objectContaining({ panelClass: ['snack-erro'] })
    );
  });

  it('deve exibir snackbar de sucesso ao receber salvarUsuarioSuccess', () => {
    actionsSubject.next(salvarUsuarioSuccess({ usuario: usuarioMock }));
    expect(snackBar.open).toHaveBeenCalledWith(
      '✅ Ana Silva salvo com sucesso!', 'Fechar',
      expect.objectContaining({ panelClass: ['snack-sucesso'] })
    );
  });

  it('deve exibir snackbar de erro ao receber salvarUsuarioError', () => {
    actionsSubject.next(salvarUsuarioError({ erro: 'Falha na conexão' }));
    expect(snackBar.open).toHaveBeenCalledWith(
      '❌ Erro ao salvar: Falha na conexão', 'Fechar',
      expect.objectContaining({ panelClass: ['snack-erro'] })
    );
  });

  it('deve exibir snackbar de sucesso ao receber deletarUsuarioSuccess', () => {
    actionsSubject.next(deletarUsuarioSuccess({ id: '1' }));
    expect(snackBar.open).toHaveBeenCalledWith(
      '🗑️ Usuário excluído com sucesso!', 'Fechar',
      expect.objectContaining({ panelClass: ['snack-sucesso'] })
    );
  });

  it('deve exibir snackbar de erro ao receber deletarUsuarioError', () => {
    actionsSubject.next(deletarUsuarioError({ id: '1', erro: 'Timeout' }));
    expect(snackBar.open).toHaveBeenCalledWith(
      '❌ Erro ao excluir: Timeout', 'Fechar',
      expect.objectContaining({ panelClass: ['snack-erro'] })
    );
  });
});
