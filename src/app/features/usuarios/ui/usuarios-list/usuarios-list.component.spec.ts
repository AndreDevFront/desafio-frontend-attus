import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UsuariosListComponent } from './usuarios-list.component';
import {
  selectUsuariosPaginados,
  selectTotalFiltrados,
  selectLoading,
  selectPaginaAtual,
  selectTamanhoPagina,
} from '../../data-access/store/usuarios.selectors';
import { setFiltroNome, setPagina, setTamanhoPagina } from '../../data-access/store/usuarios.actions';
import { PageEvent } from '@angular/material/paginator';
import { Usuario } from '../../data-access/models/usuario.model';

const usuariosMock: Usuario[] = [
  { id: '1', nome: 'Ana Silva',   email: 'ana@email.com',   cpf: '11111111111', telefone: '11999990001', tipoTelefone: 'celular' },
  { id: '2', nome: 'Bruno Costa', email: 'bruno@email.com', cpf: '22222222222', telefone: '11999990002', tipoTelefone: 'residencial' },
];

describe('UsuariosListComponent', () => {
  let fixture: ComponentFixture<UsuariosListComponent>;
  let component: UsuariosListComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectUsuariosPaginados, value: usuariosMock },
            { selector: selectTotalFiltrados,    value: 2 },
            { selector: selectLoading,           value: false },
            { selector: selectPaginaAtual,       value: 0 },
            { selector: selectTamanhoPagina,     value: 6 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve despachar setFiltroNome após debounce ao digitar no campo de busca', async () => {
    jest.useFakeTimers();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.campoBusca.setValue('Ana');
    jest.advanceTimersByTime(300);
    await Promise.resolve();

    expect(dispatchSpy).toHaveBeenCalledWith(setFiltroNome({ filtro: 'Ana' }));
  });

  it('deve despachar setPagina ao mudar página no paginador', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 6, length: 2 };
    component.onPage(pageEvent);
    expect(dispatchSpy).toHaveBeenCalledWith(setPagina({ pagina: 1 }));
  });

  it('deve despachar setTamanhoPagina ao mudar tamanho de página', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const pageEvent: PageEvent = { pageIndex: 0, pageSize: 12, length: 2 };
    component.onPage(pageEvent);
    expect(dispatchSpy).toHaveBeenCalledWith(setTamanhoPagina({ tamanho: 12 }));
  });

  it('deve ter array de skeletons com 6 itens', () => {
    expect(component.skeletons.length).toBe(6);
  });

  it('deve ter campoBusca inicializado com string vazia', () => {
    expect(component.campoBusca.value).toBe('');
  });
});
