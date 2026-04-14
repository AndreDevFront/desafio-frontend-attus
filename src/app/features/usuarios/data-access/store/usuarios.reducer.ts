import { createReducer, on } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';
import {
  loadUsuarios, loadUsuariosSuccess, loadUsuariosError,
  salvarUsuario, salvarUsuarioSuccess, salvarUsuarioError,
  setFiltroNome, abrirModalUsuario, fecharModalUsuario,
} from './usuarios.actions';

export interface UsuariosState {
  usuarios:       Usuario[];
  loading:        boolean;
  salvando:       boolean;
  erro:           string | null;
  filtroNome:     string;
  modalAberto:    boolean;
  usuarioEdicao:  Usuario | null;
}

export const initialState: UsuariosState = {
  usuarios:      [],
  loading:       false,
  salvando:      false,
  erro:          null,
  filtroNome:    '',
  modalAberto:   false,
  usuarioEdicao: null,
};

export const usuariosReducer = createReducer(
  initialState,

  on(loadUsuarios,        (state) => ({ ...state, loading: true,  erro: null })),
  on(loadUsuariosSuccess, (state, { usuarios }) => ({ ...state, loading: false, usuarios })),
  on(loadUsuariosError,   (state, { erro })     => ({ ...state, loading: false, erro })),

  on(salvarUsuario,        (state)           => ({ ...state, salvando: true,  erro: null })),
  on(salvarUsuarioSuccess, (state, { usuario }) => {
    const jaExiste = state.usuarios.some((u) => u.id === usuario.id);
    const usuarios = jaExiste
      ? state.usuarios.map((u) => (u.id === usuario.id ? usuario : u))
      : [...state.usuarios, usuario];
    return { ...state, salvando: false, usuarios, modalAberto: false, usuarioEdicao: null };
  }),
  on(salvarUsuarioError, (state, { erro }) => ({ ...state, salvando: false, erro })),

  on(setFiltroNome,      (state, { filtro })  => ({ ...state, filtroNome: filtro })),
  on(abrirModalUsuario,  (state, { usuario }) => ({ ...state, modalAberto: true,  usuarioEdicao: usuario })),
  on(fecharModalUsuario, (state)              => ({ ...state, modalAberto: false, usuarioEdicao: null })),
);
