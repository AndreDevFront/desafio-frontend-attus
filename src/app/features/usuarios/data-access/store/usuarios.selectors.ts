import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsuariosState } from './usuarios.reducer';

export const selectUsuariosState = createFeatureSelector<UsuariosState>('usuarios');

export const selectTodosUsuarios  = createSelector(selectUsuariosState, (s) => s.usuarios);
export const selectFiltroNome     = createSelector(selectUsuariosState, (s) => s.filtroNome);
export const selectLoading        = createSelector(selectUsuariosState, (s) => s.loading);
export const selectSalvando       = createSelector(selectUsuariosState, (s) => s.salvando);
export const selectErro           = createSelector(selectUsuariosState, (s) => s.erro);
export const selectModalAberto    = createSelector(selectUsuariosState, (s) => s.modalAberto);
export const selectUsuarioEdicao  = createSelector(selectUsuariosState, (s) => s.usuarioEdicao);
export const selectPaginaAtual    = createSelector(selectUsuariosState, (s) => s.pagina);
export const selectTamanhoPagina  = createSelector(selectUsuariosState, (s) => s.tamanhoPagina);

export const selectUsuariosFiltrados = createSelector(
  selectTodosUsuarios,
  selectFiltroNome,
  (usuarios, filtro) =>
    filtro.trim().length === 0
      ? usuarios
      : usuarios.filter((u) =>
          u.nome.toLowerCase().includes(filtro.toLowerCase())
        )
);

export const selectTotalFiltrados = createSelector(
  selectUsuariosFiltrados,
  (usuarios) => usuarios.length
);

export const selectUsuariosPaginados = createSelector(
  selectUsuariosFiltrados,
  selectPaginaAtual,
  selectTamanhoPagina,
  (usuarios, pagina, tamanho) => {
    const inicio = pagina * tamanho;
    return usuarios.slice(inicio, inicio + tamanho);
  }
);

export const selectTotalPaginas = createSelector(
  selectTotalFiltrados,
  selectTamanhoPagina,
  (total, tamanho) => Math.ceil(total / tamanho)
);
