import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UsuarioModalComponent } from './usuario-modal.component';
import { fecharModalUsuario, salvarUsuario } from '../../data-access/store/usuarios.actions';
import {
  selectModalAberto,
  selectUsuarioEdicao,
  selectSalvando,
} from '../../data-access/store/usuarios.selectors';
import { Usuario } from '../../data-access/models/usuario.model';

const usuarioMock: Usuario = {
  id: 1,
  nome: 'Ana Silva',
  email: 'ana@email.com',
  cpf: '12345678901',
  telefone: '11999999999',
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
            { selector: selectUsuarioEdicao, value: null  },
            { selector: selectSalvando,      value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve despachar fecharModalUsuario ao chamar fechar()', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.fechar();
    expect(dispatchSpy).toHaveBeenCalledWith(fecharModalUsuario());
  });

  it('deve despachar fecharModalUsuario ao clicar no backdrop (overlay)', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const mockEvent = { target: { classList: { contains: () => true } } } as any;
    component.fecharBackdrop(mockEvent);
    expect(dispatchSpy).toHaveBeenCalledWith(fecharModalUsuario());
  });

  it('não deve despachar fecharModalUsuario se clique não for no overlay', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const mockEvent = { target: { classList: { contains: () => false } } } as any;
    component.fecharBackdrop(mockEvent);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('deve despachar salvarUsuario com payload ao chamar salvar()', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.salvar(usuarioMock);
    expect(dispatchSpy).toHaveBeenCalledWith(
      salvarUsuario({ usuario: usuarioMock })
    );
  });

  it('deve despachar salvarUsuario mesmo com payload sem id (novo usuário)', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const { id: _, ...novoUsuario } = usuarioMock;
    component.salvar(novoUsuario);
    expect(dispatchSpy).toHaveBeenCalledWith(
      salvarUsuario({ usuario: novoUsuario })
    );
  });
});
