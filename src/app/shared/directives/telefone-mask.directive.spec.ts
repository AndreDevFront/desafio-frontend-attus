import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TelefoneMaskDirective } from './telefone-mask.directive';

@Component({
  standalone: true,
  imports: [TelefoneMaskDirective, ReactiveFormsModule],
  template: `<input appTelefoneMask [formControl]="ctrl" />`,
})
class HostComponent {
  ctrl = new FormControl('');
}

describe('TelefoneMaskDirective', () => {
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
    const dir = fixture.debugElement.query(By.directive(TelefoneMaskDirective));
    expect(dir).toBeTruthy();
  });

  it('não aplica máscara com string vazia', () => {
    typeValue('');
    expect(input.value).toBe('');
  });

  it('aplica parêntese de abertura com 1-2 dígitos', () => {
    typeValue('54');
    expect(input.value).toBe('(54');
  });

  it('aplica DDD entre parênteses com 3+ dígitos', () => {
    typeValue('549');
    expect(input.value).toBe('(54) 9');
  });

  it('aplica máscara de fixo com 10 dígitos', () => {
    typeValue('5433334444');
    expect(input.value).toBe('(54) 3333-4444');
  });

  it('aplica máscara de celular com 11 dígitos', () => {
    typeValue('54999990001');
    expect(input.value).toBe('(54) 99999-0001');
  });

  it('ignora dígitos além do 11º', () => {
    typeValue('549999900019');
    expect(input.value).toBe('(54) 99999-0001');
  });

  it('remove caracteres não numéricos antes de aplicar a máscara', () => {
    typeValue('(54) 9999-abc');
    expect(input.value).toBe('(54) 9999');
  });

  it('atualiza o FormControl com o valor mascarado', () => {
    typeValue('54999990001');
    expect(fixture.componentInstance.ctrl.value).toBe('(54) 99999-0001');
  });
});
