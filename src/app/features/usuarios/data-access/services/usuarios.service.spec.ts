import { TestBed } from '@angular/core/testing';
import { UsuariosService } from './usuarios.service';
import { firstValueFrom } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('UsuariosService', () => {
  let service: UsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('listar: retorna 6 usuários mock', fakeAsync(() => {
    let usuarios: any[] = [];
    service.listar().subscribe((u) => (usuarios = u));
    tick(800);
    expect(usuarios.length).toBe(6);
  }));

  it('salvar: adiciona novo usuário com id gerado', fakeAsync(() => {
    let salvo: any;
    service.salvar({
      nome: 'Teste', email: 't@t.com',
      cpf: '00000000000', telefone: '54999990000', tipoTelefone: 'celular',
    }).subscribe((u) => (salvo = u));
    tick(500);
    expect(salvo.id).toBeTruthy();
    expect(salvo.nome).toBe('Teste');
  }));

  it('atualizar: modifica usuário existente', fakeAsync(() => {
    let atualizado: any;
    const usuario = {
      id: '999', nome: 'Original', email: 'o@o.com',
      cpf: '11111111111', telefone: '54999990011', tipoTelefone: 'celular' as const,
    };
    service.atualizar({ ...usuario, nome: 'Modificado' }).subscribe((u) => (atualizado = u));
    tick(500);
    expect(atualizado.nome).toBe('Modificado');
  }));

  it('excluir: remove usuário e retorna id', fakeAsync(() => {
    let removedId: string | undefined;
    // Primeiro salva
    let novoId = '';
    service.salvar({ nome: 'X', email: 'x@x.com', cpf: '22222222222', telefone: '54999990022', tipoTelefone: 'celular' })
      .subscribe((u) => (novoId = u.id));
    tick(500);
    // Depois exclui
    service.excluir(novoId).subscribe((id) => (removedId = id));
    tick(300);
    expect(removedId).toBe(novoId);
  }));
});
