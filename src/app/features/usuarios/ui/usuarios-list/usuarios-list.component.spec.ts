import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UsuariosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve despachar setFiltroNome após debounce ao digitar no campo de busca', fakeAsync(() => {
    const dispatch = jest.spyOn(store, 'dispatch');
    component.campoBusca.setValue('Ana');
    tick(300);
    expect(dispatch).toHaveBeenCalledWith(setFiltroNome({ filtro: 'Ana' }));
  }));

  it('deve despachar setPagina ao mudar de página (mesmo pageSize)', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    const event: PageEvent = { pageIndex: 1, pageSize: 6, length: 12 };
    component.onPage(event);
    expect(dispatch).toHaveBeenCalledWith(setPagina({ pagina: 1 }));
  });

  it('deve despachar setTamanhoPagina quando o pageSize mudar', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    const event: PageEvent = { pageIndex: 0, pageSize: 12, length: 24 };
    component.onPage(event);
    expect(dispatch).toHaveBeenCalledWith(setTamanhoPagina({ tamanho: 12 }));
    expect(dispatch).toHaveBeenCalledWith(setPagina({ pagina: 0 }));
  });

  it('usuarios$ deve emitir o mock do store', (done) => {
    component.usuarios$.subscribe(usuarios => {
      expect(usuarios.length).toBe(2);
      expect(usuarios[0].nome).toBe('Ana Silva');
      done();
    });
  });

  it('loading$ deve emitir false', (done) => {
    component.loading$.subscribe(loading => {
      expect(loading).toBe(false);
      done();
    });
  });
});
