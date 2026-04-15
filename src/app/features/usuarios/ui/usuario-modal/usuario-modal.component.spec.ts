import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UsuarioModalComponent } from './usuario-modal.component';
import { fecharModalUsuario, salvarUsuario } from '../../data-access/store/usuarios.actions';
import { selectModalAberto, selectUsuarioEdicao, selectSalvando } from '../../data-access/store/usuarios.selectors';
import { Usuario } from '../../data-access/models/usuario.model';

const usuarioMock: Usuario = {
  id: '1',
  nome: 'Ana Silva',
  email: 'ana@email.com',
  cpf: '12345678900',
  telefone: '54999990001',
  tipoTelefone: 'celular',
};

describe('UsuarioModalComponent', () => {
  let fixture: ComponentFixture<UsuarioModalComponent>;
  let component: UsuarioModalComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioModalComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectModalAberto,   value: false },
            { selector: selectUsuarioEdicao, value: null },
            { selector: selectSalvando,      value: false },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UsuarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve disparar fecharModalUsuario ao chamar fechar()', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    component.fechar();
    expect(dispatch).toHaveBeenCalledWith(fecharModalUsuario());
  });

  it('deve disparar salvarUsuario ao chamar salvar() com payload sem id (criar)', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    const payload = { nome: 'Ana', email: 'ana@email.com', cpf: '12345678900', telefone: '54999990001', tipoTelefone: 'celular' as const };
    component.salvar(payload);
    expect(dispatch).toHaveBeenCalledWith(salvarUsuario({ usuario: payload }));
  });

  it('deve disparar salvarUsuario ao chamar salvar() com payload com id (editar)', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    component.salvar(usuarioMock);
    expect(dispatch).toHaveBeenCalledWith(salvarUsuario({ usuario: usuarioMock }));
  });

  it('deve fechar ao clicar no backdrop (.overlay)', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    const mockEvent = { target: { classList: { contains: (c: string) => c === 'overlay' } } } as unknown as MouseEvent;
    component.fecharBackdrop(mockEvent);
    expect(dispatch).toHaveBeenCalledWith(fecharModalUsuario());
  });

  it('não deve fechar ao clicar em elemento interno (não .overlay)', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    const mockEvent = { target: { classList: { contains: () => false } } } as unknown as MouseEvent;
    component.fecharBackdrop(mockEvent);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('modalAberto$ deve emitir o valor do store', (done) => {
    store.overrideSelector(selectModalAberto, true);
    store.refreshState();
    component.modalAberto$.subscribe(value => {
      expect(value).toBe(true);
      done();
    });
  });
});
