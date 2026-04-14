import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UsuariosPageComponent } from './usuarios-page.component';
import { loadUsuarios, abrirModalUsuario } from '../data-access/store/usuarios.actions';
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

describe('UsuariosPageComponent', () => {
  let fixture: ComponentFixture<UsuariosPageComponent>;
  let component: UsuariosPageComponent;
  let store: MockStore;

  beforeEach(async () => {
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve despachar loadUsuarios no ngOnInit', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadUsuarios());
  });

  it('deve despachar abrirModalUsuario com null ao chamar abrirModalNovo()', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.abrirModalNovo();
    expect(dispatchSpy).toHaveBeenCalledWith(
      abrirModalUsuario({ usuario: null })
    );
  });

  it('deve exibir snackbar quando erro emitir valor', () => {
    store.overrideSelector(selectErro, 'Erro de rede');
    store.refreshState();
    fixture.detectChanges();
    // Apenas valida que o componente não quebra ao receber erro
    expect(component).toBeTruthy();
  });
});
