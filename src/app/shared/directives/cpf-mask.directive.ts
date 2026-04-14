import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
  private readonly ngControl = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 11);

    let masked = digits;
    if (digits.length > 9) {
      masked = `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`;
    } else if (digits.length > 6) {
      masked = `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      masked = `${digits.slice(0,3)}.${digits.slice(3)}`;
    }

    input.value = masked;
    this.ngControl?.control?.setValue(digits, { emitEvent: true });
  }
}
