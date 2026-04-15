import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Usuario } from '../../data-access/models/usuario.model';
import { abrirModalUsuario } from '../../data-access/store/usuarios.actions';

const AVATAR_COLORS = [
  '#3949ab', '#00897b', '#e53935', '#8e24aa', '#f57c00',
  '#0288d1', '#558b2f', '#6d4c41', '#d81b60', '#00838f',
];

function avatarColor(nome: string): string {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash += nome.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const TIPO_ICON: Record<string, string> = {
  celular:     'smartphone',
  residencial: 'home',
  comercial:   'business',
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
  templateUrl: './usuario-card.component.html',
  styleUrl: './usuario-card.component.scss',
})
export class UsuarioCardComponent {
  @Input({ required: true }) usuario!: Usuario;
  private readonly store = inject(Store);

  get inicial()     { return this.usuario.nome.charAt(0).toUpperCase(); }
  get bgAvatar()    { return avatarColor(this.usuario.nome); }
  get tipoIcon()    { return TIPO_ICON[this.usuario.tipoTelefone] ?? 'phone'; }
  get bgTipo()      { return TIPO_COLOR[this.usuario.tipoTelefone] ?? '#666'; }
  get bgTipoLight() { return this.bgTipo + '1a'; }

  editar(): void {
    this.store.dispatch(abrirModalUsuario({ usuario: this.usuario }));
  }
}
