# Desafio Frontend — Attus Procuradoria

Aplicação Angular desenvolvida como parte do processo seletivo para a vaga de **Desenvolvedor Front-End**.

---

## 🚀 Tecnologias utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Angular | 17+ | Framework principal |
| Angular Material | 17+ | Componentes de UI |
| NgRx | 17+ | Gerenciamento de estado global |
| RxJS | 7+ | Programação reativa |
| TypeScript | 5+ | Tipagem estática |
| Jest | 29+ | Testes unitários |
| jest-preset-angular | 14+ | Integração Jest + Angular/Zone.js |

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) **v18+**
- [npm](https://www.npmjs.com/) **v9+** (ou `pnpm` / `yarn`)

---

## ⚙️ Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/AndreDevFront/desafio-frontend-attus.git
cd desafio-frontend-attus

# 2. Instale as dependências
npm install
```

---

## ▶️ Execução

```bash
# Servidor de desenvolvimento (http://localhost:4200)
npm start
```

---

## 🧪 Testes

```bash
# Executar todos os testes unitários
npm test

# Executar em modo watch
npm run test:watch

# Executar com cobertura de código
npm run test:coverage
```

> Cobertura: **~90% statements · ~96% branches · ~82% functions · ~93% lines** — acima do threshold de 60% em todas as métricas.

---

## 🏗️ Estrutura do projeto

```
src/
└── app/
    ├── features/
    │   └── usuarios/
    │       ├── data-access/
    │       │   ├── models/
    │       │   │   └── usuario.model.ts
    │       │   ├── services/
    │       │   │   ├── usuarios.service.ts
    │       │   │   └── usuarios.service.spec.ts
    │       │   └── store/
    │       │       ├── usuarios.actions.ts
    │       │       ├── usuarios.reducer.ts
    │       │       ├── usuarios.reducer.spec.ts
    │       │       ├── usuarios.selectors.ts
    │       │       ├── usuarios.selectors.spec.ts
    │       │       ├── usuarios.effects.ts
    │       │       └── usuarios.effects.spec.ts
    │       ├── feature-usuarios/
    │       │   ├── usuarios-page.component.ts
    │       │   └── usuarios-page.component.spec.ts
    │       └── ui/
    │           ├── usuario-card/
    │           │   ├── usuario-card.component.ts
    │           │   └── usuario-card.component.spec.ts
    │           ├── usuario-form/
    │           │   ├── usuario-form.component.ts
    │           │   └── usuario-form.component.spec.ts
    │           ├── usuario-modal/
    │           │   ├── usuario-modal.component.ts
    │           │   └── usuario-modal.component.spec.ts
    │           └── usuarios-list/
    │               ├── usuarios-list.component.ts
    │               └── usuarios-list.component.spec.ts
    └── shared/
        ├── components/
        │   └── confirm-dialog/
        │       └── confirm-dialog.component.ts  # Modal de confirmação reutilizável
        └── directives/
            ├── cpf-mask.directive.ts
            ├── cpf-mask.directive.spec.ts
            ├── telefone-mask.directive.ts
            └── telefone-mask.directive.spec.ts
```

---

## ✅ Funcionalidades implementadas

### Listagem de usuários
- Cards com nome, e-mail, tipo de telefone e botões de editar e excluir
- **Filtro por nome** com `debounceTime(300ms)` e `distinctUntilChanged`
- **Paginação** com `MatPaginator` (6, 12 ou 24 itens por página)
- Skeleton loading animado durante o carregamento
- Empty state com mensagem amigável
- Contador de usuários em tempo real

### Formulário (criação e edição)
- Campos: nome, e-mail, CPF, telefone, tipo de telefone
- Validação reativa com mensagens de erro por campo
- **Máscara de CPF**: `000.000.000-00`
- **Máscara de telefone**: `(00) 00000-0000` / `(00) 0000-0000`
- Botão salvar desabilitado enquanto o formulário for inválido
- Preenchimento automático ao editar

### Exclusão de usuário
- Botão de exclusão no card com `MatDialog` de confirmação
- Botão fica desabilitado e exibe ⏳ durante o request
- Feedback visual após exclusão via `MatSnackBar`

### Feedback visual (MatSnackBar)
- ✅ Sucesso ao salvar usuário
- ✅ Sucesso ao excluir usuário
- ❌ Erro ao salvar, carregar ou excluir

### Gerenciamento de estado (NgRx)
- `Actions`: `loadUsuarios`, `salvarUsuario`, `deletarUsuario`, `setFiltroNome`, `setPagina`, `setTamanhoPagina`, `abrirModalUsuario`, `fecharModalUsuario`
- `Reducer`: estado imutável com `deletando: Set<string>` para rastrear deletes em andamento
- `Selectors`: `selectUsuariosFiltrados`, `selectUsuariosPaginados`, `selectTotalFiltrados`, `selectModalAberto`, `selectSalvando`
- `Effects`: `loadUsuarios$`, `salvarUsuario$`, `deletarUsuario$` com `switchMap` + `catchError`

---

## 🧩 Cobertura de testes

| Arquivo | O que é testado |
|---|---|
| `usuarios.reducer.spec.ts` | Todos os casos: load, save, delete (deletando Set), filtro, paginação, modal |
| `usuarios.selectors.spec.ts` | Selectors de filtro, paginação e totais |
| `usuarios.effects.spec.ts` | load, save e delete — caminhos de sucesso, erro com message e erro sem message |
| `usuarios.service.spec.ts` | CRUD completo do service mock |
| `usuarios-page.component.spec.ts` | Snackbar de sucesso/erro para save e delete, dispatch de load e abrirModal |
| `cpf-mask.directive.spec.ts` | Máscara, remoção de não-numéricos, limite de 11 dígitos, sync com FormControl |
| `telefone-mask.directive.spec.ts` | Máscara fixo/celular, remoção de não-numéricos, limite de 11 dígitos, sync com FormControl |
| `usuario-card.component.spec.ts` | Renderização, getters (inicial, tipoIcon, bgAvatar), fallback, dispatch de editar |
| `usuario-form.component.spec.ts` | Validações, ngOnChanges (editar/reset), submeter com/sem id, cancelar |
| `usuario-modal.component.spec.ts` | fechar, fecharBackdrop, salvar (criar e editar), seletores do store |
| `usuarios-list.component.spec.ts` | Busca com debounce, mudança de página/pageSize, seletores |

---

## 📐 Requisitos técnicos atendidos

| Requisito | Implementação |
|---|---|
| 2+ operadores RxJS além de `map`/`tap` | `switchMap`, `debounceTime`, `distinctUntilChanged`, `catchError`, `filter`, `takeUntilDestroyed` |
| Componentes standalone | Todos os componentes usam `standalone: true` |
| Sem memory leaks | `takeUntilDestroyed`, `async pipe`, `OnPush` |
| Cobertura de testes > 60% | Todos os arquivos da feature cobertos |
| Máscaras de validação *(diferencial)* | Diretivas puras Angular sem biblioteca externa |
| Paginação *(diferencial)* | `MatPaginator` integrado ao NgRx store |
| CRUD completo *(diferencial)* | Criar, editar e excluir com confirmação e feedback visual |
