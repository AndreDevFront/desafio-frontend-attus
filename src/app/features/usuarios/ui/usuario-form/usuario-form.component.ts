import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Usuario, TipoTelefone } from '../../data-access/models/usuario.model';

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
    MatProgressSpinnerModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submeter()" class="form">

      <!-- Nome -->
      <mat-form-field appearance="outline">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="nome" placeholder="Nome completo" />
        @if (form.get('nome')?.hasError('required') && form.get('nome')?.touched) {
          <mat-error>Nome é obrigatório.</mat-error>
        }
      </mat-form-field>

      <!-- E-mail -->
      <mat-form-field appearance="outline">
        <mat-label>E-mail</mat-label>
        <input matInput formControlName="email" type="email" placeholder="email@exemplo.com" />
        @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
          <mat-error>E-mail é obrigatório.</mat-error>
        }
        @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
          <mat-error>Formato de e-mail inválido.</mat-error>
        }
      </mat-form-field>

      <!-- CPF -->
      <mat-form-field appearance="outline">
        <mat-label>CPF</mat-label>
        <input matInput formControlName="cpf" placeholder="000.000.000-00" />
        @if (form.get('cpf')?.hasError('required') && form.get('cpf')?.touched) {
          <mat-error>CPF é obrigatório.</mat-error>
        }
        @if (form.get('cpf')?.hasError('cpfInvalido') && form.get('cpf')?.touched) {
          <mat-error>CPF deve conter 11 dígitos.</mat-error>
        }
      </mat-form-field>

      <!-- Telefone -->
      <mat-form-field appearance="outline">
        <mat-label>Telefone</mat-label>
        <input matInput formControlName="telefone" placeholder="(00) 00000-0000" />
        @if (form.get('telefone')?.hasError('required') && form.get('telefone')?.touched) {
          <mat-error>Telefone é obrigatório.</mat-error>
        }
        @if (form.get('telefone')?.hasError('telefoneInvalido') && form.get('telefone')?.touched) {
          <mat-error>Telefone deve ter 10 ou 11 dígitos.</mat-error>
        }
      </mat-form-field>

      <!-- Tipo de telefone -->
      <mat-form-field appearance="outline">
        <mat-label>Tipo de telefone</mat-label>
        <mat-select formControlName="tipoTelefone">
          <mat-option value="celular">Celular</mat-option>
          <mat-option value="residencial">Residencial</mat-option>
          <mat-option value="comercial">Comercial</mat-option>
        </mat-select>
        @if (form.get('tipoTelefone')?.hasError('required') && form.get('tipoTelefone')?.touched) {
          <mat-error>Tipo de telefone é obrigatório.</mat-error>
        }
      </mat-form-field>

      <!-- Rodapé -->
      <div class="form-actions">
        <button type="button" mat-stroked-button (click)="cancelar.emit()">Cancelar</button>
        <button
          type="submit"
          mat-flat-button
          color="primary"
          [disabled]="form.invalid || salvando"
        >
          @if (salvando) {
            <mat-spinner diameter="20" />
          } @else {
            {{ usuarioEdicao ? 'Salvar alterações' : 'Cadastrar' }}
          }
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      mat-form-field { width: 100%; }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
    }
  `],
})
export class UsuarioFormComponent implements OnChanges {
  @Input() usuarioEdicao: Usuario | null = null;
  @Input() salvando = false;
  @Output() readonly submeterForm = new EventEmitter<Omit<Usuario, 'id'> | Usuario>();
  @Output() readonly cancelar     = new EventEmitter<void>();

  readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
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
