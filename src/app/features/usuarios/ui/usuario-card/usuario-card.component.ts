import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Usuario } from '../../data-access/models/usuario.model';
import { abrirModalUsuario } from '../../data-access/store/usuarios.actions';

@Component({
  selector: 'app-usuario-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <mat-card class="usuario-card">
      <mat-card-header>
        <div mat-card-avatar class="avatar">
          {{ usuario.nome.charAt(0).toUpperCase() }}
        </div>
        <mat-card-title>{{ usuario.nome }}</mat-card-title>
        <mat-card-subtitle>{{ usuario.email }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <mat-chip-set>
          <mat-chip>{{ usuario.tipoTelefone | titlecase }}</mat-chip>
        </mat-chip-set>
      </mat-card-content>

      <mat-card-actions align="end">
        <button
          mat-stroked-button
          color="primary"
          (click)="editar()"
          aria-label="Editar usuário"
        >
          <mat-icon>edit</mat-icon>
          Editar
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .usuario-card {
      border-radius: 12px;
      transition: box-shadow 180ms ease;
      &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    }
    .avatar {
      background-color: #3f51b5;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 600;
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }
  `],
})
export class UsuarioCardComponent {
  @Input({ required: true }) usuario!: Usuario;
  private readonly store = inject(Store);

  editar(): void {
    this.store.dispatch(abrirModalUsuario({ usuario: this.usuario }));
  }
}
