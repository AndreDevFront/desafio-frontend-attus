import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

const MOCK_USUARIOS: Usuario[] = [
  { id: '1', nome: 'Ana Silva',    email: 'ana.silva@email.com',    cpf: '123.456.789-00', telefone: '(54) 99999-0001', tipoTelefone: 'celular'     },
  { id: '2', nome: 'Bruno Souza',  email: 'bruno.souza@email.com',  cpf: '234.567.890-11', telefone: '(54) 98888-0002', tipoTelefone: 'celular'     },
  { id: '3', nome: 'Carla Lima',   email: 'carla.lima@email.com',   cpf: '345.678.901-22', telefone: '(54) 3333-0003', tipoTelefone: 'residencial' },
  { id: '4', nome: 'Diego Rocha',  email: 'diego.rocha@email.com',  cpf: '456.789.012-33', telefone: '(54) 97777-0004', tipoTelefone: 'celular'     },
  { id: '5', nome: 'Eva Martins',  email: 'eva.martins@email.com',  cpf: '567.890.123-44', telefone: '(54) 3222-0005', tipoTelefone: 'comercial'   },
  { id: '6', nome: 'Felipe Costa', email: 'felipe.costa@email.com', cpf: '678.901.234-55', telefone: '(54) 96666-0006', tipoTelefone: 'celular'     },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private usuarios: Usuario[] = [...MOCK_USUARIOS];

  listar(): Observable<Usuario[]> {
    return of(this.usuarios).pipe(delay(800));
  }

  salvar(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    const novo: Usuario = { ...usuario, id: generateId() };
    this.usuarios = [...this.usuarios, novo];
    return of(novo).pipe(delay(500));
  }

  atualizar(usuario: Usuario): Observable<Usuario> {
    this.usuarios = this.usuarios.map((u) => (u.id === usuario.id ? usuario : u));
    return of(usuario).pipe(delay(500));
  }

  excluir(id: string): Observable<string> {
    return of(id).pipe(
      delay(300),
      switchMap((userId) => {
        this.usuarios = this.usuarios.filter((u) => u.id !== userId);
        return of(userId);
      })
    );
  }
}
