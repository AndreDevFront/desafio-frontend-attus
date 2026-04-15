import { createReducer, on } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';
import {
  loadUsuarios, loadUsuariosSuccess, loadUsuariosError,
  salvarUsuario, salvarUsuarioSuccess, salvarUsuarioError,
  deletarUsuario, deletarUsuarioSuccess, deletarUsuarioError,
  setFiltroNome, abrirModalUsuario, fecharModalUsuario,
  setPagina, setTamanhoPagina,
} from './usuarios.actions';

export interface UsuariosState {
  usuarios:      Usuario[];
  loading:       boolean;
  salvando:      boolean;
  deletando:     Set<string>;
  erro:          string | null;
  filtroNome:    string;
  modalAberto:   boolean;
  usuarioEdicao: Usuario | null;
  pagina:        number;
  tamanhoPagina: number;
}

export const initialState: UsuariosState = {
  usuarios:      [],
  loading:       false,
  salvando:      false,
  deletando:     new Set<string>(),
  erro:          null,
  filtroNome:    '',
  modalAberto:   false,
  usuarioEdicao: null,
  pagina:        0,
  tamanhoPagina: 6,
};

export const usuariosReducer = createReducer(
  initialState,

  on(loadUsuarios,        (state) => ({ ...state, loading: true, erro: null })),
  on(loadUsuariosSuccess, (state, { usuarios }) => ({ ...state, loading: false, usuarios, pagina: 0 })),
  on(loadUsuariosError,   (state, { erro })     => ({ ...state, loading: false, erro })),

  on(salvarUsuario,        (state)              => ({ ...state, salvando: true, erro: null })),
  on(salvarUsuarioSuccess, (state, { usuario }) => {
    const jaExiste = state.usuarios.some((u) => u.id === usuario.id);
    const usuarios = jaExiste
      ? state.usuarios.map((u) => (u.id === usuario.id ? usuario : u))
      : [...state.usuarios, usuario];
    return { ...state, salvando: false, usuarios, modalAberto: false, usuarioEdicao: null };
  }),
  on(salvarUsuarioError, (state, { erro }) => ({ ...state, salvando: false, erro })),

  on(deletarUsuario, (state, { id }) => {
    const deletando = new Set(state.deletando);
    deletando.add(id);
    return { ...state, deletando };
  }),
  on(deletarUsuarioSuccess, (state, { id }) => {
    const deletando = new Set(state.deletando);
    deletando.delete(id);
    return { ...state, deletando, usuarios: state.usuarios.filter((u) => u.id !== id) };
  }),
  on(deletarUsuarioError, (state, { id, erro }) => {
    const deletando = new Set(state.deletando);
    deletando.delete(id);
    return { ...state, deletando, erro };
  }),

  on(setFiltroNome,      (state, { filtro })  => ({ ...state, filtroNome: filtro, pagina: 0 })),
  on(abrirModalUsuario,  (state, { usuario }) => ({ ...state, modalAberto: true,  usuarioEdicao: usuario ?? null })),
  on(fecharModalUsuario, (state)              => ({ ...state, modalAberto: false, usuarioEdicao: null })),

  on(setPagina,        (state, { pagina })  => ({ ...state, pagina })),
  on(setTamanhoPagina, (state, { tamanho }) => ({ ...state, tamanhoPagina: tamanho, pagina: 0 })),
);
