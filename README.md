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
| Vitest | latest | Testes unitários |

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

# Executar com cobertura
npm run test:coverage
```

---

## 🏗️ Estrutura do projeto

```
src/
└── app/
    ├── features/
    │   └── usuarios/
    │       ├── data-access/
    │       │   ├── models/          # Interfaces e tipos
    │       │   ├── services/        # UsuariosService (mock com delay)
    │       │   └── store/           # NgRx: actions, reducer, selectors, effects
    │       ├── feature-usuarios/    # Componente raiz da feature
    │       └── ui/
    │           ├── usuario-card/    # Card de exibição do usuário
    │           ├── usuario-form/    # Formulário reativo com máscaras
    │           ├── usuario-modal/   # Modal de criação/edição
    │           └── usuarios-list/   # Listagem com busca e paginação
    └── shared/
        └── directives/
            ├── cpf-mask.directive.ts      # Máscara 000.000.000-00
            └── telefone-mask.directive.ts # Máscara (00) 00000-0000
```

---

## ✅ Funcionalidades implementadas

### Listagem de usuários
- Cards com nome, e-mail, tipo de telefone e botão de editar
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

### Gerenciamento de estado (NgRx)
- `Actions`: `loadUsuarios`, `salvarUsuario`, `setFiltroNome`, `setPagina`, `setTamanhoPagina`
- `Reducer`: estado imutável com tipagem forte
- `Selectors`: `selectUsuariosFiltrados`, `selectUsuariosPaginados`, `selectTotalFiltrados`, `selectTotalPaginas`
- `Effects`: fluxo assíncrono com `switchMap` + `catchError`

---

## 📐 Requisitos técnicos atendidos

| Requisito | Implementação |
|---|---|
| 2+ operadores RxJS além de `map`/`tap` | `switchMap`, `debounceTime`, `distinctUntilChanged`, `catchError` |
| Componentes standalone | Todos os componentes usam `standalone: true` |
| Sem memory leaks | `takeUntilDestroyed`, `async pipe`, `OnPush` |
| Cobertura de testes > 60% | Reducer, selectors, service e diretivas testados |
| Máscaras de validação *(diferencial)* | Diretivas puras Angular sem biblioteca externa |
| Paginação *(diferencial)* | `MatPaginator` integrado ao NgRx store |
