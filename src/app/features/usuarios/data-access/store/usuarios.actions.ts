import { createAction, props } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';

// Listar
export const loadUsuarios        = createAction('[Usuarios] Load Usuarios');
export const loadUsuariosSuccess = createAction('[Usuarios] Load Usuarios Success', props<{ usuarios: Usuario[] }>());
export const loadUsuariosError   = createAction('[Usuarios] Load Usuarios Error',   props<{ erro: string }>());

// Salvar (criar ou editar)
export const salvarUsuario        = createAction('[Usuarios] Salvar Usuario',         props<{ usuario: Omit<Usuario, 'id'> | Usuario }>());
export const salvarUsuarioSuccess = createAction('[Usuarios] Salvar Usuario Success', props<{ usuario: Usuario }>());
export const salvarUsuarioError   = createAction('[Usuarios] Salvar Usuario Error',   props<{ erro: string }>());

// UI
export const setFiltroNome      = createAction('[Usuarios] Set Filtro Nome',  props<{ filtro: string }>());
export const abrirModalUsuario  = createAction('[Usuarios] Abrir Modal',      props<{ usuario: Usuario | null }>());
export const fecharModalUsuario = createAction('[Usuarios] Fechar Modal');

// Paginação
export const setPagina       = createAction('[Usuarios] Set Pagina',        props<{ pagina: number }>());
export const setTamanhoPagina = createAction('[Usuarios] Set Tamanho Pagina', props<{ tamanho: number }>());
