import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTelefoneMask]',
  standalone: true,
})
export class TelefoneMaskDirective {
  private readonly ngControl = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 11);

    let masked = digits;
    if (digits.length > 10) {
      // Celular: (00) 00000-0000
      masked = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    } else if (digits.length > 6) {
      // Fixo parcial: (00) 0000-
      masked = `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    } else if (digits.length > 2) {
      masked = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    } else if (digits.length > 0) {
      masked = `(${digits}`;
    }

    input.value = masked;
    this.ngControl?.control?.setValue(digits, { emitEvent: true });
  }
}
