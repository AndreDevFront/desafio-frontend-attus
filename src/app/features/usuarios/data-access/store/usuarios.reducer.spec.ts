import { usuariosReducer, initialState, UsuariosState } from './usuarios.reducer';
import {
  loadUsuarios, loadUsuariosSuccess, loadUsuariosError,
  salvarUsuario, salvarUsuarioSuccess, salvarUsuarioError,
  deletarUsuario, deletarUsuarioSuccess, deletarUsuarioError,
  setFiltroNome, abrirModalUsuario, fecharModalUsuario,
  setPagina, setTamanhoPagina,
} from './usuarios.actions';
import { Usuario } from '../models/usuario.model';

const u1: Usuario = { id: '1', nome: 'Ana',   email: 'ana@e.com',   cpf: '111', telefone: '111', tipoTelefone: 'celular' };
const u2: Usuario = { id: '2', nome: 'Bruno', email: 'bruno@e.com', cpf: '222', telefone: '222', tipoTelefone: 'residencial' };

describe('usuariosReducer', () => {

  it('deve retornar o estado inicial', () => {
    const state = usuariosReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initialState);
  });

  // --- Load ---
  it('loadUsuarios: deve setar loading true', () => {
    const state = usuariosReducer(initialState, loadUsuarios());
    expect(state.loading).toBe(true);
    expect(state.erro).toBeNull();
  });

  it('loadUsuariosSuccess: deve popular usuários e resetar página', () => {
    const state = usuariosReducer({ ...initialState, pagina: 2 }, loadUsuariosSuccess({ usuarios: [u1] }));
    expect(state.loading).toBe(false);
    expect(state.usuarios).toEqual([u1]);
    expect(state.pagina).toBe(0);
  });

  it('loadUsuariosError: deve setar erro e parar loading', () => {
    const state = usuariosReducer(initialState, loadUsuariosError({ erro: 'Falha' }));
    expect(state.loading).toBe(false);
    expect(state.erro).toBe('Falha');
  });

  // --- Salvar ---
  it('salvarUsuario: deve setar salvando true', () => {
    const state = usuariosReducer(initialState, salvarUsuario({ usuario: u1 }));
    expect(state.salvando).toBe(true);
  });

  it('salvarUsuarioSuccess: deve adicionar novo usuário', () => {
    const state = usuariosReducer(initialState, salvarUsuarioSuccess({ usuario: u1 }));
    expect(state.usuarios).toContain(u1);
    expect(state.salvando).toBe(false);
    expect(state.modalAberto).toBe(false);
  });

  it('salvarUsuarioSuccess: deve atualizar usuário existente', () => {
    const base = { ...initialState, usuarios: [u1] };
    const atualizado = { ...u1, nome: 'Ana Editada' };
    const state = usuariosReducer(base, salvarUsuarioSuccess({ usuario: atualizado }));
    expect(state.usuarios[0].nome).toBe('Ana Editada');
    expect(state.usuarios.length).toBe(1);
  });

  it('salvarUsuarioError: deve setar erro e parar salvando', () => {
    const state = usuariosReducer(initialState, salvarUsuarioError({ erro: 'Erro save' }));
    expect(state.salvando).toBe(false);
    expect(state.erro).toBe('Erro save');
  });

  // --- Deletar ---
  it('deletarUsuario: deve adicionar id ao Set deletando', () => {
    const state = usuariosReducer(initialState, deletarUsuario({ id: '1' }));
    expect(state.deletando.has('1')).toBe(true);
  });

  it('deletarUsuarioSuccess: deve remover usuário da lista e do Set deletando', () => {
    const base: UsuariosState = { ...initialState, usuarios: [u1, u2], deletando: new Set(['1']) };
    const state = usuariosReducer(base, deletarUsuarioSuccess({ id: '1' }));
    expect(state.usuarios).toEqual([u2]);
    expect(state.deletando.has('1')).toBe(false);
  });

  it('deletarUsuarioError: deve remover id do Set deletando e setar erro', () => {
    const base: UsuariosState = { ...initialState, deletando: new Set(['1']) };
    const state = usuariosReducer(base, deletarUsuarioError({ id: '1', erro: 'Timeout' }));
    expect(state.deletando.has('1')).toBe(false);
    expect(state.erro).toBe('Timeout');
  });

  // --- UI ---
  it('setFiltroNome: deve atualizar filtro e resetar página', () => {
    const state = usuariosReducer({ ...initialState, pagina: 3 }, setFiltroNome({ filtro: 'Ana' }));
    expect(state.filtroNome).toBe('Ana');
    expect(state.pagina).toBe(0);
  });

  it('abrirModalUsuario: deve abrir modal com usuário', () => {
    const state = usuariosReducer(initialState, abrirModalUsuario({ usuario: u1 }));
    expect(state.modalAberto).toBe(true);
    expect(state.usuarioEdicao).toEqual(u1);
  });

  it('fecharModalUsuario: deve fechar modal e limpar edição', () => {
    const base = { ...initialState, modalAberto: true, usuarioEdicao: u1 };
    const state = usuariosReducer(base, fecharModalUsuario());
    expect(state.modalAberto).toBe(false);
    expect(state.usuarioEdicao).toBeNull();
  });

  it('setPagina: deve atualizar página', () => {
    const state = usuariosReducer(initialState, setPagina({ pagina: 2 }));
    expect(state.pagina).toBe(2);
  });

  it('setTamanhoPagina: deve atualizar tamanho e resetar página', () => {
    const state = usuariosReducer({ ...initialState, pagina: 2 }, setTamanhoPagina({ tamanho: 12 }));
    expect(state.tamanhoPagina).toBe(12);
    expect(state.pagina).toBe(0);
  });
});
