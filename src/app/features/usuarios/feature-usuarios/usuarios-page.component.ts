import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { loadUsuarios, abrirModalUsuario } from '../data-access/store/usuarios.actions';
import { UsuariosListComponent } from '../ui/usuarios-list/usuarios-list.component';
import { UsuarioModalComponent } from '../ui/usuario-modal/usuario-modal.component';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    UsuariosListComponent,
    UsuarioModalComponent,
  ],
  templateUrl: './usuarios-page.component.html',
  styleUrl: './usuarios-page.component.scss',
})
export class UsuariosPageComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(loadUsuarios());
  }

  abrirModalNovo(): void {
    this.store.dispatch(abrirModalUsuario({ usuario: null }));
  }
}
