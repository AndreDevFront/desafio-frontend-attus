import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CpfMaskDirective } from './cpf-mask.directive';

@Component({
  standalone: true,
  imports: [CpfMaskDirective, ReactiveFormsModule],
  template: `<input appCpfMask [formControl]="ctrl" />`,
})
class TestComponent {
  ctrl = new FormControl('');
}

describe('CpfMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  const dispatchInput = (value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  it('formata CPF completo corretamente', () => {
    dispatchInput('12345678901');
    expect(input.value).toBe('123.456.789-01');
  });

  it('formata parcialmente com 7 dígitos', () => {
    dispatchInput('1234567');
    expect(input.value).toBe('123.456.7');
  });

  it('formata parcialmente com 4 dígitos', () => {
    dispatchInput('1234');
    expect(input.value).toBe('123.4');
  });

  it('ignora caracteres não numéricos', () => {
    dispatchInput('abc123def456ghi789jk01');
    expect(input.value).toBe('123.456.789-01');
  });

  it('limita a 11 dígitos', () => {
    dispatchInput('123456789012345');
    expect(input.value).toBe('123.456.789-01');
  });

  it('atualiza o FormControl com valor formatado', () => {
    dispatchInput('12345678901');
    expect(fixture.componentInstance.ctrl.value).toBe('123.456.789-01');
  });
});
