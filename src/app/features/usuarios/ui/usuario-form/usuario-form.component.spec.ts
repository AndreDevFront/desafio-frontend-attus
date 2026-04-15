import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UsuarioFormComponent } from './usuario-form.component';
import { Usuario } from '../../data-access/models/usuario.model';

const usuarioMock: Usuario = {
  id: '1',
  nome: 'Ana Silva',
  email: 'ana@email.com',
  cpf: '12345678900',
  telefone: '54999990001',
  tipoTelefone: 'celular',
};

describe('UsuarioFormComponent', () => {
  let fixture: ComponentFixture<UsuarioFormComponent>;
  let component: UsuarioFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioFormComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('formulário deve ser inválido quando vazio', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('formulário deve ser válido com todos os campos preenchidos corretamente', () => {
    component.form.setValue({
      nome: 'Ana Silva',
      email: 'ana@email.com',
      cpf: '123.456.789-00',
      telefone: '(54) 99999-0001',
      tipoTelefone: 'celular',
    });
    expect(component.form.valid).toBe(true);
  });

  it('deve invalidar e-mail com formato incorreto', () => {
    component.form.patchValue({ email: 'email-invalido' });
    expect(component.form.get('email')?.invalid).toBe(true);
  });

  it('deve invalidar CPF com menos de 11 dígitos', () => {
    component.form.patchValue({ cpf: '123.456' });
    expect(component.form.get('cpf')?.invalid).toBe(true);
  });

  it('deve invalidar telefone com menos de 10 dígitos', () => {
    component.form.patchValue({ telefone: '(54) 999' });
    expect(component.form.get('telefone')?.invalid).toBe(true);
  });

  it('deve preencher o formulário ao receber usuarioEdicao via ngOnChanges', () => {
    component.usuarioEdicao = usuarioMock;
    component.ngOnChanges({
      usuarioEdicao: { currentValue: usuarioMock, previousValue: null, firstChange: true, isFirstChange: () => true },
    });
    expect(component.form.value.nome).toBe('Ana Silva');
    expect(component.form.value.email).toBe('ana@email.com');
  });

  it('deve resetar o formulário ao receber usuarioEdicao null', () => {
    component.form.patchValue({ nome: 'Teste' });
    component.usuarioEdicao = null;
    component.ngOnChanges({
      usuarioEdicao: { currentValue: null, previousValue: usuarioMock, firstChange: false, isFirstChange: () => false },
    });
    expect(component.form.value.nome).toBeNull();
    expect(component.form.value.tipoTelefone).toBe('celular');
  });

  it('não deve emitir submeterForm se o formulário for inválido', () => {
    const spy = jest.spyOn(component.submeterForm, 'emit');
    component.submeter();
    expect(spy).not.toHaveBeenCalled();
  });

  it('deve emitir submeterForm com payload correto ao submeter formulário válido', () => {
    const spy = jest.spyOn(component.submeterForm, 'emit');
    component.form.setValue({
      nome: 'Ana Silva',
      email: 'ana@email.com',
      cpf: '123.456.789-00',
      telefone: '(54) 99999-0001',
      tipoTelefone: 'celular',
    });
    component.submeter();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      nome: 'Ana Silva',
      email: 'ana@email.com',
      cpf: '12345678900',
      telefone: '54999990001',
    }));
  });

  it('deve incluir id no payload ao editar um usuário existente', () => {
    const spy = jest.spyOn(component.submeterForm, 'emit');
    component.usuarioEdicao = usuarioMock;
    component.form.setValue({
      nome: 'Ana Silva',
      email: 'ana@email.com',
      cpf: '123.456.789-00',
      telefone: '(54) 99999-0001',
      tipoTelefone: 'celular',
    });
    component.submeter();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('deve emitir cancelar ao chamar cancelar output', () => {
    const spy = jest.spyOn(component.cancelar, 'emit');
    component.cancelar.emit();
    expect(spy).toHaveBeenCalled();
  });
});
