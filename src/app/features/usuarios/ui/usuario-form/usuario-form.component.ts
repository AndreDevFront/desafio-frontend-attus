import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Usuario, TipoTelefone } from '../../data-access/models/usuario.model';
import { CpfMaskDirective } from '../../../../shared/directives/cpf-mask.directive';
import { TelefoneMaskDirective } from '../../../../shared/directives/telefone-mask.directive';

function cpfValidator(control: { value: string }) {
  const digits = control.value?.replace(/\D/g, '');
  return digits && digits.length === 11 ? null : { cpfInvalido: true };
}

function telefoneValidator(control: { value: string }) {
  const digits = control.value?.replace(/\D/g, '');
  return digits && (digits.length === 10 || digits.length === 11) ? null : { telefoneInvalido: true };
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CpfMaskDirective,
    TelefoneMaskDirective,
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss',
})
export class UsuarioFormComponent implements OnChanges {
  @Input() usuarioEdicao: Usuario | null = null;
  @Input() salvando = false;
  @Output() readonly submeterForm = new EventEmitter<Omit<Usuario, 'id'> | Usuario>();
  @Output() readonly cancelar     = new EventEmitter<void>();

  readonly form: FormGroup;
  private readonly fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      nome:         ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      cpf:          ['', [Validators.required, cpfValidator]],
      telefone:     ['', [Validators.required, telefoneValidator]],
      tipoTelefone: ['celular' as TipoTelefone, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioEdicao'] && this.usuarioEdicao) {
      this.form.patchValue(this.usuarioEdicao);
    } else if (changes['usuarioEdicao'] && !this.usuarioEdicao) {
      this.form.reset({ tipoTelefone: 'celular' });
    }
  }

  submeter(): void {
    if (this.form.invalid) return;
    const valor = this.form.getRawValue();
    const payload = {
      ...valor,
      cpf:      valor.cpf?.replace(/\D/g, ''),
      telefone: valor.telefone?.replace(/\D/g, ''),
      ...(this.usuarioEdicao ? { id: this.usuarioEdicao.id } : {}),
    };
    this.submeterForm.emit(payload);
  }
}
