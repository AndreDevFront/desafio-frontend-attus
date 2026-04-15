import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  selectUsuariosPaginados,
  selectTotalFiltrados,
  selectLoading,
  selectPaginaAtual,
  selectTamanhoPagina,
} from '../../data-access/store/usuarios.selectors';
import { setFiltroNome, setPagina, setTamanhoPagina } from '../../data-access/store/usuarios.actions';
import { UsuarioCardComponent } from '../usuario-card/usuario-card.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    UsuarioCardComponent,
  ],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.scss',
})
export class UsuariosListComponent {
  private readonly store = inject(Store);
  private currentPageSize = 6;

  readonly campoBusca     = new FormControl('');
  readonly usuarios$      = this.store.select(selectUsuariosPaginados);
  readonly total$         = this.store.select(selectTotalFiltrados);
  readonly loading$       = this.store.select(selectLoading);
  readonly pagina$        = this.store.select(selectPaginaAtual);
  readonly tamanhoPagina$ = this.store.select(selectTamanhoPagina);
  readonly skeletons      = [1, 2, 3, 4, 5, 6];

  constructor() {
    this.store.select(selectTamanhoPagina)
      .pipe(takeUntilDestroyed())
      .subscribe(size => this.currentPageSize = size);

    this.campoBusca.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe((filtro) =>
      this.store.dispatch(setFiltroNome({ filtro: filtro ?? '' }))
    );
  }

  onPage(event: PageEvent): void {
    if (event.pageSize !== this.currentPageSize) {
      this.store.dispatch(setTamanhoPagina({ tamanho: event.pageSize }));
    }
    this.store.dispatch(setPagina({ pagina: event.pageIndex }));
  }
}
