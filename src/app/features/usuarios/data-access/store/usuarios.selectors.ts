import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsuariosState } from './usuarios.reducer';

export const selectUsuariosState = createFeatureSelector<UsuariosState>('usuarios');

export const selectTodosUsuarios = createSelector(
  selectUsuariosState,
  (state) => state.usuarios
);

export const selectFiltroNome = createSelector(
  selectUsuariosState,
  (state) => state.filtroNome
);

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

export const selectLoading      = createSelector(selectUsuariosState, (s) => s.loading);
export const selectSalvando     = createSelector(selectUsuariosState, (s) => s.salvando);
export const selectErro         = createSelector(selectUsuariosState, (s) => s.erro);
export const selectModalAberto  = createSelector(selectUsuariosState, (s) => s.modalAberto);
export const selectUsuarioEdicao = createSelector(selectUsuariosState, (s) => s.usuarioEdicao);
