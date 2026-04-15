import { TestBed } from '@angular/core/testing';
import { UsuariosService } from './usuarios.service';
import { Usuario } from '../models/usuario.model';

describe('UsuariosService', () => {
  let service: UsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('listar()', () => {
    it('deve retornar a lista inicial de usuários', (done) => {
      service.listar().subscribe((usuarios) => {
        expect(usuarios.length).toBeGreaterThan(0);
        expect(usuarios[0].nome).toBeDefined();
        done();
      });
    });
  });

  describe('salvar()', () => {
    it('deve adicionar um novo usuário com id gerado', (done) => {
      const novo: Omit<Usuario, 'id'> = {
        nome: 'Teste User',
        email: 'teste@email.com',
        cpf: '12345678900',
        telefone: '54999990000',
        tipoTelefone: 'celular',
      };

      service.salvar(novo).subscribe((salvo) => {
        expect(salvo.id).toBeDefined();
        expect(salvo.nome).toBe('Teste User');
        done();
      });
    });

    it('deve incluir o novo usuário na listagem', (done) => {
      const novo: Omit<Usuario, 'id'> = {
        nome: 'Novo Na Lista',
        email: 'novo@email.com',
        cpf: '98765432100',
        telefone: '54988880000',
        tipoTelefone: 'comercial',
      };

      service.salvar(novo).subscribe(() => {
        service.listar().subscribe((usuarios) => {
          const encontrado = usuarios.find((u) => u.nome === 'Novo Na Lista');
          expect(encontrado).toBeDefined();
          done();
        });
      });
    });
  });

  describe('atualizar()', () => {
    it('deve atualizar os dados de um usuário existente', (done) => {
      service.listar().subscribe((usuarios) => {
        const original = usuarios[0];
        const atualizado: Usuario = { ...original, nome: 'Nome Atualizado' };

        service.atualizar(atualizado).subscribe((resultado) => {
          expect(resultado.nome).toBe('Nome Atualizado');
          expect(resultado.id).toBe(original.id);
          done();
        });
      });
    });

    it('deve refletir a atualização na listagem', (done) => {
      service.listar().subscribe((usuarios) => {
        const original = usuarios[0];
        const atualizado: Usuario = { ...original, email: 'novo@atualizado.com' };

        service.atualizar(atualizado).subscribe(() => {
          service.listar().subscribe((lista) => {
            const encontrado = lista.find((u) => u.id === original.id);
            expect(encontrado?.email).toBe('novo@atualizado.com');
            done();
          });
        });
      });
    });
  });

  describe('excluir()', () => {
    it('deve retornar o id do usuário excluído', (done) => {
      service.listar().subscribe((usuarios) => {
        const alvo = usuarios[0];

        service.excluir(alvo.id).subscribe((id) => {
          expect(id).toBe(alvo.id);
          done();
        });
      });
    });

    it('deve remover o usuário da listagem', (done) => {
      service.listar().subscribe((usuarios) => {
        const alvo = usuarios[0];

        service.excluir(alvo.id).subscribe(() => {
          service.listar().subscribe((lista) => {
            const ainda = lista.find((u) => u.id === alvo.id);
            expect(ainda).toBeUndefined();
            done();
          });
        });
      });
    });
  });
});
