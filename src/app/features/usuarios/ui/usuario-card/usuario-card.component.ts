import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Usuario } from '../../data-access/models/usuario.model';
import { abrirModalUsuario } from '../../data-access/store/usuarios.actions';

const AVATAR_COLORS = [
  '#3949ab','#00897b','#e53935','#8e24aa','#f57c00',
  '#0288d1','#558b2f','#6d4c41','#d81b60','#00838f',
];

function avatarColor(nome: string): string {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash += nome.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const TIPO_ICON: Record<string, string> = {
  celular:      'smartphone',
  residencial:  'home',
  comercial:    'business',
};

const TIPO_COLOR: Record<string, string> = {
  celular:     '#3949ab',
  residencial: '#00897b',
  comercial:   '#f57c00',
};

@Component({
  selector: 'app-usuario-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <article class="card" [attr.aria-label]="'Usuário ' + usuario.nome">

      <!-- Avatar -->
      <div class="avatar" [style.background]="bgAvatar">
        {{ inicial }}
      </div>

      <!-- Info -->
      <div class="info">
        <span class="nome">{{ usuario.nome }}</span>
        <span class="email">
          <mat-icon class="info-icon">mail_outline</mat-icon>
          {{ usuario.email }}
        </span>
        <span class="telefone">
          <mat-icon class="info-icon" [style.color]="bgTipo">{{ tipoIcon }}</mat-icon>
          <span class="chip" [style.background]="bgTipoLight" [style.color]="bgTipo">
            {{ usuario.tipoTelefone | titlecase }}
          </span>
          {{ usuario.telefone }}
        </span>
      </div>

      <!-- Ação -->
      <button
        mat-icon-button
        class="btn-editar"
        (click)="editar()"
        aria-label="Editar usuário"
        matTooltip="Editar usuário"
      >
        <mat-icon>edit</mat-icon>
      </button>
    </article>
  `,
  styles: [`
    .card {
      background: var(--color-surface);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: 18px 16px 18px 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: box-shadow 180ms, transform 180ms;
      border: 1px solid var(--color-border);
      &:hover {
        box-shadow: var(--shadow-card-hover);
        transform: translateY(-2px);
      }
    }

    /* Avatar */
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    /* Info */
    .info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nome {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--color-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .email, .telefone {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: var(--color-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .info-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
    .chip {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 1px 8px;
      border-radius: 20px;
      letter-spacing: 0.02em;
    }

    /* Botão */
    .btn-editar {
      flex-shrink: 0;
      color: var(--color-primary);
      opacity: 0.7;
      transition: opacity 180ms, background 180ms;
      &:hover { opacity: 1; background: rgba(57,73,171,0.08); }
    }
  `],
})
export class UsuarioCardComponent {
  @Input({ required: true }) usuario!: Usuario;
  private readonly store = inject(Store);

  get inicial()    { return this.usuario.nome.charAt(0).toUpperCase(); }
  get bgAvatar()   { return avatarColor(this.usuario.nome); }
  get tipoIcon()   { return TIPO_ICON[this.usuario.tipoTelefone] ?? 'phone'; }
  get bgTipo()     { return TIPO_COLOR[this.usuario.tipoTelefone] ?? '#666'; }
  get bgTipoLight(){
    const hex = this.bgTipo;
    return hex + '1a'; // 10% opacidade
  }

  editar(): void {
    this.store.dispatch(abrirModalUsuario({ usuario: this.usuario }));
  }
}
