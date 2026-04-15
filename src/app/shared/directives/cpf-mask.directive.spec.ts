import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CpfMaskDirective } from './cpf-mask.directive';

@Component({
  standalone: true,
  imports: [CpfMaskDirective, ReactiveFormsModule],
  template: `<input appCpfMask [formControl]="ctrl" />`,
})
class HostComponent {
  ctrl = new FormControl('');
}

describe('CpfMaskDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  function typeValue(value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('deve criar a diretiva', () => {
    const dir = fixture.debugElement.query(By.directive(CpfMaskDirective));
    expect(dir).toBeTruthy();
  });

  it('não aplica máscara com menos de 4 dígitos', () => {
    typeValue('123');
    expect(input.value).toBe('123');
  });

  it('aplica ponto após 3 dígitos (4-6 dígitos)', () => {
    typeValue('1234');
    expect(input.value).toBe('123.4');
  });

  it('aplica dois pontos (7-9 dígitos)', () => {
    typeValue('1234567');
    expect(input.value).toBe('123.456.7');
  });

  it('aplica máscara completa com 11 dígitos', () => {
    typeValue('12345678901');
    expect(input.value).toBe('123.456.789-01');
  });

  it('ignora dígitos além do 11º', () => {
    typeValue('123456789012');
    expect(input.value).toBe('123.456.789-01');
  });

  it('remove caracteres não numéricos antes de aplicar a máscara', () => {
    typeValue('abc.123.456-78');
    expect(input.value).toBe('123.456.78');
  });

  it('atualiza o FormControl com o valor mascarado', () => {
    typeValue('12345678901');
    expect(fixture.componentInstance.ctrl.value).toBe('123.456.789-01');
  });
});
