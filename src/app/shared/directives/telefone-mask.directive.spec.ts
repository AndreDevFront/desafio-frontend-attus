import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TelefoneMaskDirective } from './telefone-mask.directive';

@Component({
  standalone: true,
  imports: [TelefoneMaskDirective, ReactiveFormsModule],
  template: `<input appTelefoneMask [formControl]="ctrl" />`,
})
class TestComponent {
  ctrl = new FormControl('');
}

describe('TelefoneMaskDirective', () => {
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

  it('formata celular completo (11 dígitos)', () => {
    dispatchInput('51999235494');
    expect(input.value).toBe('(51) 99923-5494');
  });

  it('formata fixo completo (10 dígitos)', () => {
    dispatchInput('5133334444');
    expect(input.value).toBe('(51) 3333-4444');
  });

  it('formata parcialmente com 7 dígitos', () => {
    dispatchInput('5133334');
    expect(input.value).toBe('(51) 3333-4');
  });

  it('formata parcialmente com 3 dígitos', () => {
    dispatchInput('519');
    expect(input.value).toBe('(51) 9');
  });

  it('ignora caracteres não numéricos', () => {
    dispatchInput('(51) 99923-5494');
    expect(input.value).toBe('(51) 99923-5494');
  });

  it('limita a 11 dígitos', () => {
    dispatchInput('519992354941234');
    expect(input.value).toBe('(51) 99923-5494');
  });

  it('atualiza o FormControl com valor formatado', () => {
    dispatchInput('51999235494');
    expect(fixture.componentInstance.ctrl.value).toBe('(51) 99923-5494');
  });
});
