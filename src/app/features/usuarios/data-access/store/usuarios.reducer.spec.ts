import { usuariosReducer, initialState } from './usuarios.reducer';
import {
  loadUsuarios, loadUsuariosSuccess, loadUsuariosError,
  salvarUsuarioSuccess, setFiltroNome,
  abrirModalUsuario, fecharModalUsuario,
  setPagina, setTamanhoPagina,
} from './usuarios.actions';
import { Usuario } from '../models/usuario.model';

const mockUsuario: Usuario = {
  id: '1', nome: 'Ana Silva', email: 'ana@email.com',
  cpf: '12345678900', telefone: '54999990001', tipoTelefone: 'celular',
};

describe('usuariosReducer', () => {
  it('deve retornar o estado inicial', () => {
    const state = usuariosReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initialState);
  });

  it('loadUsuarios: seta loading=true e limpa erro', () => {
    const state = usuariosReducer({ ...initialState, erro: 'erro anterior' }, loadUsuarios());
    expect(state.loading).toBe(true);
    expect(state.erro).toBeNull();
  });

  it('loadUsuariosSuccess: seta usuarios e loading=false', () => {
    const state = usuariosReducer(
      { ...initialState, loading: true },
      loadUsuariosSuccess({ usuarios: [mockUsuario] })
    );
    expect(state.loading).toBe(false);
    expect(state.usuarios).toEqual([mockUsuario]);
    expect(state.pagina).toBe(0);
  });

  it('loadUsuariosError: seta erro e loading=false', () => {
    const state = usuariosReducer(
      { ...initialState, loading: true },
      loadUsuariosError({ erro: 'Falha na rede' })
    );
    expect(state.loading).toBe(false);
    expect(state.erro).toBe('Falha na rede');
  });

  it('salvarUsuarioSuccess: adiciona usuario novo', () => {
    const state = usuariosReducer(
      { ...initialState, salvando: true },
      salvarUsuarioSuccess({ usuario: mockUsuario })
    );
    expect(state.usuarios).toContain(mockUsuario);
    expect(state.salvando).toBe(false);
    expect(state.modalAberto).toBe(false);
  });

  it('salvarUsuarioSuccess: atualiza usuario existente', () => {
    const atualizado = { ...mockUsuario, nome: 'Ana Atualizada' };
    const state = usuariosReducer(
      { ...initialState, usuarios: [mockUsuario] },
      salvarUsuarioSuccess({ usuario: atualizado })
    );
    expect(state.usuarios[0].nome).toBe('Ana Atualizada');
    expect(state.usuarios.length).toBe(1);
  });

  it('setFiltroNome: atualiza filtro e reseta pagina', () => {
    const state = usuariosReducer(
      { ...initialState, pagina: 3 },
      setFiltroNome({ filtro: 'Ana' })
    );
    expect(state.filtroNome).toBe('Ana');
    expect(state.pagina).toBe(0);
  });

  it('abrirModalUsuario: abre modal com usuario', () => {
    const state = usuariosReducer(initialState, abrirModalUsuario({ usuario: mockUsuario }));
    expect(state.modalAberto).toBe(true);
    expect(state.usuarioEdicao).toEqual(mockUsuario);
  });

  it('fecharModalUsuario: fecha modal e limpa edicao', () => {
    const state = usuariosReducer(
      { ...initialState, modalAberto: true, usuarioEdicao: mockUsuario },
      fecharModalUsuario()
    );
    expect(state.modalAberto).toBe(false);
    expect(state.usuarioEdicao).toBeNull();
  });

  it('setPagina: atualiza pagina corretamente', () => {
    const state = usuariosReducer(initialState, setPagina({ pagina: 2 }));
    expect(state.pagina).toBe(2);
  });

  it('setTamanhoPagina: atualiza tamanho e reseta pagina', () => {
    const state = usuariosReducer(
      { ...initialState, pagina: 2 },
      setTamanhoPagina({ tamanho: 12 })
    );
    expect(state.tamanhoPagina).toBe(12);
    expect(state.pagina).toBe(0);
  });
});
