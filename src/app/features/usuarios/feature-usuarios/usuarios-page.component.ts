import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { loadUsuarios, abrirModalUsuario } from '../data-access/store/usuarios.actions';
import { selectErro } from '../data-access/store/usuarios.selectors';
import { UsuariosListComponent } from '../ui/usuarios-list/usuarios-list.component';
import { UsuarioModalComponent } from '../ui/usuario-modal/usuario-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

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
  private readonly store    = inject(Store);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.store.select(selectErro).pipe(
      filter(Boolean),
      takeUntilDestroyed()
    ).subscribe((erro) => {
      this.snackBar.open(erro, 'Fechar', { duration: 4000, panelClass: 'snack-erro' });
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsuarios());
  }

  abrirModalNovo(): void {
    this.store.dispatch(abrirModalUsuario({ usuario: null }));
  }
}
