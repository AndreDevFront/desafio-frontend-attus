import { selectUsuariosFiltrados, selectUsuariosPaginados, selectTotalFiltrados, selectTotalPaginas } from './usuarios.selectors';
import { initialState, UsuariosState } from './usuarios.reducer';
import { Usuario } from '../models/usuario.model';

const makeUsuario = (id: string, nome: string): Usuario => ({
  id, nome, email: `${id}@test.com`, cpf: '00000000000', telefone: '00000000000', tipoTelefone: 'celular',
});

const usuarios: Usuario[] = [
  makeUsuario('1', 'Ana Silva'),
  makeUsuario('2', 'Bruno Costa'),
  makeUsuario('3', 'Carla Ana'),
  makeUsuario('4', 'Diego'),
  makeUsuario('5', 'Eva'),
  makeUsuario('6', 'Felipe'),
  makeUsuario('7', 'Gabi'),
  makeUsuario('8', 'Henrique'),
];

const buildState = (partial: Partial<UsuariosState>): { usuarios: UsuariosState } => ({
  usuarios: { ...initialState, ...partial },
});

describe('selectUsuariosFiltrados', () => {
  it('retorna todos quando filtro vazio', () => {
    const result = selectUsuariosFiltrados.projector(usuarios, '');
    expect(result.length).toBe(8);
  });

  it('filtra por nome case-insensitive', () => {
    const result = selectUsuariosFiltrados.projector(usuarios, 'ana');
    expect(result.length).toBe(2); // Ana Silva, Carla Ana
    expect(result.map((u) => u.nome)).toContain('Ana Silva');
    expect(result.map((u) => u.nome)).toContain('Carla Ana');
  });

  it('retorna vazio quando sem correspondência', () => {
    const result = selectUsuariosFiltrados.projector(usuarios, 'xyz');
    expect(result.length).toBe(0);
  });
});

describe('selectUsuariosPaginados', () => {
  it('retorna primeira página com 6 itens', () => {
    const result = selectUsuariosPaginados.projector(usuarios, 0, 6);
    expect(result.length).toBe(6);
    expect(result[0].nome).toBe('Ana Silva');
  });

  it('retorna segunda página com os itens restantes', () => {
    const result = selectUsuariosPaginados.projector(usuarios, 1, 6);
    expect(result.length).toBe(2); // 8 total - 6 da pag 0
    expect(result[0].nome).toBe('Gabi');
  });

  it('retorna vazio quando página fora do range', () => {
    const result = selectUsuariosPaginados.projector(usuarios, 5, 6);
    expect(result.length).toBe(0);
  });
});

describe('selectTotalPaginas', () => {
  it('calcula total de páginas corretamente', () => {
    expect(selectTotalPaginas.projector(8, 6)).toBe(2);
    expect(selectTotalPaginas.projector(12, 6)).toBe(2);
    expect(selectTotalPaginas.projector(13, 6)).toBe(3);
    expect(selectTotalPaginas.projector(0, 6)).toBe(0);
  });
});

describe('selectTotalFiltrados', () => {
  it('conta total de itens filtrados', () => {
    expect(selectTotalFiltrados.projector(usuarios)).toBe(8);
    expect(selectTotalFiltrados.projector([])).toBe(0);
  });
});
