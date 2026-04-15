import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UsuarioCardComponent } from './usuario-card.component';
import { abrirModalUsuario } from '../../data-access/store/usuarios.actions';
import { Usuario } from '../../data-access/models/usuario.model';

const usuarioMock: Usuario = {
  id: '1',
  nome: 'Ana Silva',
  email: 'ana@email.com',
  cpf: '12345678901',
  telefone: '11999999999',
  tipoTelefone: 'celular',
};

describe('UsuarioCardComponent', () => {
  let fixture: ComponentFixture<UsuarioCardComponent>;
  let component: UsuarioCardComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioCardComponent],
      providers: [provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioCardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.usuario = usuarioMock;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir a inicial do nome no avatar', () => {
    expect(component.inicial).toBe('A');
  });

  it('deve retornar o ícone correto para celular', () => {
    expect(component.tipoIcon).toBe('smartphone');
  });

  it('deve retornar ícone padrão para tipo desconhecido', () => {
    component.usuario = { ...usuarioMock, tipoTelefone: 'outro' as any };
    expect(component.tipoIcon).toBe('phone');
  });

  it('deve retornar bgTipoLight com sufixo de opacidade', () => {
    expect(component.bgTipoLight).toContain('1a');
  });

  it('deve despachar abrirModalUsuario ao clicar em editar', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.editar();
    expect(dispatchSpy).toHaveBeenCalledWith(
      abrirModalUsuario({ usuario: usuarioMock })
    );
  });

  it('deve gerar cor de avatar baseada no nome', () => {
    const cor = component.bgAvatar;
    expect(cor).toBeTruthy();
    expect(cor.startsWith('#')).toBe(true);
  });
});
