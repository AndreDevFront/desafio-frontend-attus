import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UsuarioFormComponent } from './usuario-form.component';
import { Usuario } from '../../data-access/models/usuario.model';

const usuarioMock: Usuario = {
  id: 1,
  nome: 'Ana Silva',
  email: 'ana@email.com',
  cpf: '123.456.789-01',
  telefone: '(11) 99999-9999',
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

  it('deve inicializar o formulário inválido (campos vazios)', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('deve marcar nome como inválido quando vazio', () => {
    component.form.get('nome')?.setValue('');
    expect(component.form.get('nome')?.hasError('required')).toBe(true);
  });

  it('deve marcar email inválido com formato errado', () => {
    component.form.get('email')?.setValue('email-invalido');
    expect(component.form.get('email')?.hasError('email')).toBe(true);
  });

  it('deve marcar cpf inválido com menos de 11 dígitos', () => {
    component.form.get('cpf')?.setValue('123');
    expect(component.form.get('cpf')?.hasError('cpfInvalido')).toBe(true);
  });

  it('deve marcar telefone inválido com dígitos incorretos', () => {
    component.form.get('telefone')?.setValue('123');
    expect(component.form.get('telefone')?.hasError('telefoneInvalido')).toBe(true);
  });

  it('deve preencher o formulário ao receber usuarioEdicao via ngOnChanges', () => {
    component.usuarioEdicao = usuarioMock;
    component.ngOnChanges({
      usuarioEdicao: { currentValue: usuarioMock, previousValue: null, firstChange: true, isFirstChange: () => true },
    });
    expect(component.form.get('nome')?.value).toBe(usuarioMock.nome);
    expect(component.form.get('email')?.value).toBe(usuarioMock.email);
  });

  it('deve resetar o formulário quando usuarioEdicao for null', () => {
    component.usuarioEdicao = null;
    component.ngOnChanges({
      usuarioEdicao: { currentValue: null, previousValue: usuarioMock, firstChange: false, isFirstChange: () => false },
    });
    expect(component.form.get('nome')?.value).toBeFalsy();
  });

  it('não deve emitir submeterForm se formulário inválido', () => {
    const emitSpy = vi.spyOn(component.submeterForm, 'emit');
    component.submeter();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('deve emitir submeterForm com payload correto quando válido', () => {
    const emitSpy = vi.spyOn(component.submeterForm, 'emit');
    component.form.setValue({
      nome: 'Ana Silva',
      email: 'ana@email.com',
      cpf: '123.456.789-01',
      telefone: '(11) 99999-9999',
      tipoTelefone: 'celular',
    });
    component.submeter();
    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'Ana Silva', email: 'ana@email.com' })
    );
  });

  it('deve remover máscara do CPF no payload emitido', () => {
    const emitSpy = vi.spyOn(component.submeterForm, 'emit');
    component.form.setValue({
      nome: 'Ana Silva',
      email: 'ana@email.com',
      cpf: '123.456.789-01',
      telefone: '(11) 99999-9999',
      tipoTelefone: 'celular',
    });
    component.submeter();
    const payload = (emitSpy.mock.calls[0][0] as any);
    expect(payload.cpf).toBe('12345678901');
  });

  it('deve emitir evento cancelar ao chamar cancelar.emit()', () => {
    const emitSpy = vi.spyOn(component.cancelar, 'emit');
    component.cancelar.emit();
    expect(emitSpy).toHaveBeenCalled();
  });
});
