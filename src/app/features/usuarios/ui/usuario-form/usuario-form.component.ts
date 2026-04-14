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
  const cpf = control.value?.replace(/\D/g, '');
  return cpf && cpf.length === 11 ? null : { cpfInvalido: true };
}

function telefoneValidator(control: { value: string }) {
  const tel = control.value?.replace(/\D/g, '');
  return tel && (tel.length === 10 || tel.length === 11) ? null : { telefoneInvalido: true };
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
  template: `
    <form [formGroup]="form" (ngSubmit)="submeter()" class="form">

      <!-- Linha 1: Nome + Email -->
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Nome completo</mat-label>
          <mat-icon matPrefix>person_outline</mat-icon>
          <input matInput formControlName="nome" placeholder="João da Silva" />
          @if (form.get('nome')?.hasError('required') && form.get('nome')?.touched) {
            <mat-error>Nome é obrigatório.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>E-mail</mat-label>
          <mat-icon matPrefix>mail_outline</mat-icon>
          <input matInput formControlName="email" type="email" placeholder="email@exemplo.com" />
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>E-mail é obrigatório.</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Formato de e-mail inválido.</mat-error>
          }
        </mat-form-field>
      </div>

      <!-- Linha 2: CPF + Telefone -->
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>CPF</mat-label>
          <mat-icon matPrefix>badge</mat-icon>
          <input
            matInput
            formControlName="cpf"
            placeholder="000.000.000-00"
            appCpfMask
            maxlength="14"
          />
          @if (form.get('cpf')?.hasError('required') && form.get('cpf')?.touched) {
            <mat-error>CPF é obrigatório.</mat-error>
          }
          @if (form.get('cpf')?.hasError('cpfInvalido') && form.get('cpf')?.touched) {
            <mat-error>CPF deve conter 11 dígitos.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Telefone</mat-label>
          <mat-icon matPrefix>phone</mat-icon>
          <input
            matInput
            formControlName="telefone"
            placeholder="(00) 00000-0000"
            appTelefoneMask
            maxlength="15"
          />
          @if (form.get('telefone')?.hasError('required') && form.get('telefone')?.touched) {
            <mat-error>Telefone é obrigatório.</mat-error>
          }
          @if (form.get('telefone')?.hasError('telefoneInvalido') && form.get('telefone')?.touched) {
            <mat-error>Telefone deve ter 10 ou 11 dígitos.</mat-error>
          }
        </mat-form-field>
      </div>

      <!-- Tipo de telefone -->
      <mat-form-field appearance="outline">
        <mat-label>Tipo de telefone</mat-label>
        <mat-icon matPrefix>settings_phone</mat-icon>
        <mat-select formControlName="tipoTelefone">
          <mat-option value="celular">📱 Celular</mat-option>
          <mat-option value="residencial">🏠 Residencial</mat-option>
          <mat-option value="comercial">🏢 Comercial</mat-option>
        </mat-select>
        @if (form.get('tipoTelefone')?.hasError('required') && form.get('tipoTelefone')?.touched) {
          <mat-error>Tipo de telefone é obrigatório.</mat-error>
        }
      </mat-form-field>

      <!-- Ações -->
      <div class="form-actions">
        <button type="button" mat-stroked-button class="btn-cancelar" (click)="cancelar.emit()">
          Cancelar
        </button>
        <button
          type="submit"
          mat-flat-button
          class="btn-salvar"
          [disabled]="form.invalid || salvando"
        >
          @if (salvando) {
            <mat-spinner diameter="20" />
          } @else {
            <mat-icon>{{ usuarioEdicao ? 'save' : 'person_add' }}</mat-icon>
            {{ usuarioEdicao ? 'Salvar alterações' : 'Cadastrar usuário' }}
          }
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    mat-form-field { width: 100%; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 12px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 8px;
    }
    .btn-cancelar {
      border-color: #ddd;
      color: var(--color-muted);
      border-radius: 10px;
    }
    .btn-salvar {
      background: linear-gradient(135deg, #3949ab, #5c6bc0);
      color: #fff;
      border-radius: 10px;
      gap: 6px;
      font-weight: 500;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    @media (max-width: 480px) {
      .form-row { grid-template-columns: 1fr; gap: 0; }
    }
  `],
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
    const payload = this.usuarioEdicao
      ? { ...valor, id: this.usuarioEdicao.id }
      : valor;
    this.submeterForm.emit(payload);
  }
}
