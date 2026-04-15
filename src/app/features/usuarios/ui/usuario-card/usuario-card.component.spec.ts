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
  cpf: '12345678900',
  telefone: '54999990001',
  tipoTelefone: 'celular',
};

describe('UsuarioCardComponent', () => {
  let fixture: ComponentFixture<UsuarioCardComponent>;
  let component: UsuarioCardComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioCardComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UsuarioCardComponent);
    component = fixture.componentInstance;
    component.usuario = usuarioMock;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir a inicial do nome no avatar', () => {
    const avatar = fixture.debugElement.query(By.css('.avatar'));
    expect(avatar.nativeElement.textContent.trim()).toBe('A');
  });

  it('deve exibir o nome do usuário', () => {
    const el = fixture.debugElement.query(By.css('.nome'));
    expect(el.nativeElement.textContent).toContain('Ana Silva');
  });

  it('deve exibir o e-mail do usuário', () => {
    const el = fixture.debugElement.query(By.css('.email'));
    expect(el.nativeElement.textContent).toContain('ana@email.com');
  });

  it('getter inicial deve retornar a primeira letra maiúscula', () => {
    expect(component.inicial).toBe('A');
  });

  it('getter bgAvatar deve retornar uma cor hex', () => {
    expect(component.bgAvatar).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('getter tipoIcon deve retornar smartphone para celular', () => {
    expect(component.tipoIcon).toBe('smartphone');
  });

  it('getter tipoIcon deve retornar home para residencial', () => {
    component.usuario = { ...usuarioMock, tipoTelefone: 'residencial' };
    expect(component.tipoIcon).toBe('home');
  });

  it('getter tipoIcon deve retornar business para comercial', () => {
    component.usuario = { ...usuarioMock, tipoTelefone: 'comercial' };
    expect(component.tipoIcon).toBe('business');
  });

  it('getter tipoIcon deve retornar phone como fallback para tipo desconhecido', () => {
    component.usuario = { ...usuarioMock, tipoTelefone: 'desconhecido' as any };
    expect(component.tipoIcon).toBe('phone');
  });

  it('getter bgTipo deve retornar #666 como fallback para tipo desconhecido', () => {
    component.usuario = { ...usuarioMock, tipoTelefone: 'desconhecido' as any };
    expect(component.bgTipo).toBe('#666');
  });

  it('deve disparar a action abrirModalUsuario ao chamar editar()', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    component.editar();
    expect(dispatch).toHaveBeenCalledWith(abrirModalUsuario({ usuario: usuarioMock }));
  });
});
