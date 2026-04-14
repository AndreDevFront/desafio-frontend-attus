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
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    const masked = this.applyMask(digits);

    // Atualiza o input visual E o FormControl com o valor formatado
    input.value = masked;
    this.ngControl?.control?.setValue(masked, { emitEvent: true });
  }

  private applyMask(digits: string): string {
    if (digits.length > 9)
      return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`;
    if (digits.length > 6)
      return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
    if (digits.length > 3)
      return `${digits.slice(0,3)}.${digits.slice(3)}`;
    return digits;
  }
}
