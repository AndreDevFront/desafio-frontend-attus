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
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    const masked = this.applyMask(digits);

    // Atualiza o input visual E o FormControl com o valor formatado
    input.value = masked;
    this.ngControl?.control?.setValue(masked, { emitEvent: true });
  }

  private applyMask(digits: string): string {
    if (digits.length > 10)
      return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    if (digits.length > 6)
      return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    if (digits.length > 2)
      return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length > 0)
      return `(${digits}`;
    return digits;
  }
}
