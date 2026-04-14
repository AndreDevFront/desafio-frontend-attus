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
  template: `
    <div class="layout">

      <!-- HEADER -->
      <header class="app-header">
        <div class="header-inner">
          <div class="header-brand">
            <div class="header-logo">
              <mat-icon>manage_accounts</mat-icon>
            </div>
            <div>
              <span class="header-title">Gestão de Usuários</span>
              <span class="header-sub">Attus Procuradoria</span>
            </div>
          </div>
          <div class="header-actions">
            <button
              mat-flat-button
              class="btn-novo-header"
              (click)="abrirModalNovo()"
              aria-label="Novo usuário"
            >
              <mat-icon>person_add</mat-icon>
              Novo Usuário
            </button>
          </div>
        </div>
      </header>

      <!-- CONTEÚDO -->
      <main class="page-main">
        <app-usuarios-list />
      </main>

      <!-- FAB vermelho (mobile / conforme protótipo) -->
      <button
        mat-fab
        class="fab-novo"
        (click)="abrirModalNovo()"
        aria-label="Novo usuário"
        matTooltip="Novo usuário"
        matTooltipPosition="left"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>

    <app-usuario-modal />
  `,
  styles: [`
    .layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--color-bg);
    }

    /* HEADER */
    .app-header {
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 60%, #5c6bc0 100%);
      box-shadow: 0 2px 12px rgba(26,35,126,0.18);
      position: sticky;
      top: 0;
      z-index: 200;
    }
    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .header-logo {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon { color: #fff; font-size: 22px; }
    }
    .header-title {
      display: block;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      line-height: 1.2;
    }
    .header-sub {
      display: block;
      color: rgba(255,255,255,0.65);
      font-size: 0.72rem;
      font-weight: 400;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .btn-novo-header {
      background: rgba(255,255,255,0.15);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 10px;
      gap: 6px;
      font-weight: 500;
      transition: background 180ms;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { background: rgba(255,255,255,0.25); }
    }

    /* MAIN */
    .page-main {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 32px 24px 100px;
    }

    /* FAB */
    .fab-novo {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 100;
      background: #e53935 !important;
      color: #fff !important;
      box-shadow: 0 4px 16px rgba(229,57,53,0.4) !important;
      transition: transform 180ms, box-shadow 180ms;
      &:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 24px rgba(229,57,53,0.5) !important;
      }
    }

    @media (max-width: 600px) {
      .header-actions { display: none; }
      .page-main { padding: 16px 12px 100px; }
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
