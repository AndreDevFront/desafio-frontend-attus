import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatFabButton,
    MatIconModule,
    MatSnackBarModule,
    UsuariosListComponent,
    UsuarioModalComponent,
  ],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Gerenciamento de Usuários</h1>
      </header>

      <main>
        <app-usuarios-list />
      </main>

      <!-- FAB vermelho para novo usuário -->
      <button
        mat-fab
        color="warn"
        class="fab-novo"
        aria-label="Novo usuário"
        (click)="abrirModalNovo()"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>

    <app-usuario-modal />
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
      position: relative;
      min-height: 100vh;
    }
    .page-header {
      margin-bottom: 24px;
      h1 { font-size: 1.75rem; font-weight: 500; color: #333; }
    }
    .fab-novo {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 100;
    }
  `],
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
