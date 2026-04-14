# 🧪 Desafio Técnico — Desenvolvedor Front End Angular

> Avaliação técnica para a vaga de **Desenvolvedor Front End Angular** na **Attus**.

---

## 📋 Sobre o Desafio

Este repositório contém a resolução completa do desafio técnico proposto pela Attus, que avalia conhecimentos práticos em:

- Angular 17+
- RxJS
- NgRx / Signals
- Angular Material
- Testes unitários
- TypeScript
- Integração com APIs REST

---

## 🗂️ Estrutura do Projeto

```
desafio-frontend-attus/
├── src/
│   ├── app/
│   │   ├── core/                        # Serviços globais, interceptors, guards
│   │   ├── shared/                      # Componentes, pipes e diretivas reutilizáveis
│   │   └── features/
│   │       └── usuarios/                # Feature principal do desafio
│   │           ├── data-access/         # Serviços, NgRx (actions, reducer, selectors, effects)
│   │           ├── ui/                  # Componentes de apresentação (cards, modal, form)
│   │           └── feature-usuarios/    # Smart component (orquestra estado e UI)
├── README.md
└── ...
```

---

## 🚀 Stack Utilizada

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [Angular](https://angular.dev) | 17+ | Framework principal |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Linguagem base |
| [Angular Material](https://material.angular.io) | 17+ | Biblioteca de componentes UI |
| [NgRx](https://ngrx.io) | 17+ | Gerenciamento de estado global |
| [RxJS](https://rxjs.dev) | 7.x | Programação reativa |
| [Vitest](https://vitest.dev) | Latest | Testes unitários |
| [Angular Testing Library](https://testing-library.com/angular) | Latest | Testes de componentes |

---

## ✅ Funcionalidades Implementadas

### Listagem de Usuários
- Cards com nome, e-mail e botão de editar
- Filtro por nome com debounce de 300ms
- Estado de loading durante o carregamento
- Mensagem de erro em caso de falha na requisição
- Dados mockados via serviço Angular

### Modal de Cadastro / Edição
- Formulário reativo com os campos: **e-mail**, **nome**, **CPF**, **telefone** e **tipo de telefone**
- Validação com mensagens de erro por campo
- Validação de formato: e-mail, CPF e telefone
- Botão salvar desabilitado enquanto o formulário estiver inválido
- Preenchimento automático ao editar um usuário existente

---

## 🧠 Decisões Técnicas

### Gerenciamento de Estado
O estado da listagem de usuários é gerenciado com **NgRx**, seguindo o padrão `Actions → Reducer → Selectors → Effects`. Para o estado local do formulário e do carrinho (questão 3.1), foram utilizados **Angular Signals**.

### Componentes Standalone
Todos os componentes foram criados como **standalone**, eliminando a necessidade de NgModules e alinhando com as boas práticas do Angular 17+.

### Gerenciamento de Subscriptions
As subscriptions são gerenciadas com `takeUntilDestroyed()` (Angular 16+) e `async pipe`, eliminando memory leaks sem necessidade de `ngOnDestroy` manual.

### Operadores RxJS utilizados
- `switchMap` — cancelamento de requisições anteriores
- `debounceTime` — debounce no campo de busca
- `distinctUntilChanged` — evita requisições duplicadas
- `catchError` — tratamento de erros sem quebrar o stream
- `forkJoin` — requisições paralelas
- `filter` — filtragem de valores inválidos no stream

---

## 🧪 Testes

Os testes foram escritos com **Vitest** e cobrem acima de 60% do código, incluindo:

- Serviços (lógica de negócio e requisições mockadas)
- Reducers NgRx (transições de estado)
- Selectors NgRx (derivação de estado)
- Componentes (renderização e interações)

Para rodar os testes:

```bash
npm run test
```

Para verificar a cobertura:

```bash
npm run test:coverage
```

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- Node.js **18+**
- npm **9+** ou yarn
- Angular CLI **17+**

```bash
npm install -g @angular/cli
```

### Instalação

```bash
# Clone o repositório
git clone https://github.com/AndreDevFront/desafio-frontend-attus.git

# Acesse a pasta
cd desafio-frontend-attus

# Instale as dependências
npm install
```

### Executando

```bash
# Ambiente de desenvolvimento
npm start
# ou
ng serve
```

Acesse em: [http://localhost:4200](http://localhost:4200)

---

## 📦 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run test` | Executa os testes unitários |
| `npm run test:coverage` | Executa os testes com relatório de cobertura |
| `npm run lint` | Executa o linter |

---

## 📬 Contato

Qualquer dúvida sobre a implementação, entre em contato pelo e-mail informado no processo seletivo.

---

> Desenvolvido por **André Luz da Silva** como parte do processo seletivo Attus. 🚀
