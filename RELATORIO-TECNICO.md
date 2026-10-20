# Relatório técnico — Formula One API

## A. Identificação

- **Projeto original:** `F1`
- **Repositório:** [amisterdan7/formula-one-api](https://github.com/amisterdan7/formula-one-api)
- **Visibilidade:** Público
- **Diretório local:** `C:\02 - Projects\F1`
- **Branch local:** `main`
- **Remote:** `https://github.com/amisterdan7/formula-one-api.git`
- **Commit de documentação inicial:** `00daed2c1233635feeca6cd0652f80afb3956c20`
- **Push:** não executado

## B. Resumo executivo

O projeto é uma API REST minimalista sobre Fórmula 1, desenvolvida com Node.js,
TypeScript e Fastify. Atualmente, disponibiliza dados estáticos em memória sobre
equipes e pilotos.

Não há banco de dados, autenticação ou integração com serviços externos. A
documentação principal do projeto está em [README.MD](./README.MD).

## C. Arquitetura

| Arquivo | Responsabilidade |
|---|---|
| [`src/server.ts`](./src/server.ts) | Inicializa o Fastify, registra CORS, define as rotas e mantém os dados de pilotos |
| [`src/teams.ts`](./src/teams.ts) | Define a lista estática de equipes |
| [`package.json`](./package.json) | Dependências e scripts de execução e build |
| [`tsconfig.json`](./tsconfig.json) | Configuração do TypeScript |
| [`package-lock.json`](./package-lock.json) | Lockfile das dependências |

A aplicação possui uma estrutura simples, sem separação em controllers, services,
repositories ou camada de persistência.

## D. Tecnologias

- Node.js 20 ou superior, conforme a documentação existente
- TypeScript `^5.4.3`
- Fastify `^5.12.7`
- `tsx` `^4.7.1`
- `tsup` `^8.0.2`
- `@types/node` `^20.11.30`
- `@types/cors` `^2.8.19`
- CORS importado pela aplicação, mas ausente nas dependências de runtime

Durante a análise, estavam disponíveis no ambiente Node.js `v24.18.1` e npm
`11.16.0`.

## E. Regras de negócio

- As equipes são mantidas em um array estático em `src/teams.ts`.
- Os pilotos são mantidos em um array estático em `src/server.ts`.
- Cada piloto possui `id`, `name` e `teamId`.
- A rota de detalhe procura o piloto pelo identificador.
- A equipe é localizada pelo `teamId` do piloto.
- Quando o piloto existe, a resposta inclui os dados básicos da equipe.
- Quando o piloto não existe, a API retorna HTTP `404`.
- O CORS está configurado para aceitar qualquer origem (`*`).
- A aplicação escuta na porta fixa `3000`.
- A variável `PORT` existente no arquivo `.env` não é utilizada pelo código.

Existe uma inconsistência nos dados expostos: `GET /drivers/` apresenta Lewis
Hamilton associado à Ferrari, enquanto `GET /drivers/1` usa o `teamId` `2`, que
corresponde à Mercedes.

## F. Endpoints

### `GET /teams/`

Retorna uma lista estática de equipes.

Resposta atual:

```json
[
  {
    "id": 1,
    "name": "Ferrari"
  }
]
```

- Não recebe parâmetros nem corpo.
- Retorna HTTP `200`.
- Embora existam mais equipes definidas em `src/teams.ts`, a rota atualmente
  retorna somente Ferrari.

### `GET /drivers/`

Retorna uma lista estática de pilotos.

Resposta atual:

```json
[
  {
    "id": 1,
    "name": "Lewis Hamilton",
    "team": {
      "id": 1,
      "name": "Ferrari"
    }
  }
]
```

- Não recebe parâmetros nem corpo.
- Retorna HTTP `200`.
- A rota atualmente retorna somente Lewis Hamilton.

### `GET /drivers/:id`

Busca um piloto pelo parâmetro de rota `id`.

Pilotos definidos na aplicação:

| ID | Piloto | Equipe retornada no detalhe |
|---:|---|---|
| 1 | Lewis Hamilton | Mercedes |
| 2 | Max Verstappen | Red Bull Racing |
| 3 | Charles Leclerc | Ferrari |
| 4 | Lando Norris | McLaren |

Exemplo:

```bash
curl http://localhost:3000/drivers/2
```

Resposta para um piloto encontrado:

```json
{
  "id": 2,
  "name": "Max Verstappen",
  "team": {
    "id": 3,
    "name": "Red Bull Racing"
  }
}
```

Para um identificador sem correspondência, a resposta é HTTP `404`:

```json
{
  "error": "Driver not found"
}
```

O parâmetro é convertido com `parseInt`. Não existe schema de validação nem
tratamento específico para formatos inválidos.

## G. Configuração e execução

Instalar dependências:

```bash
npm install
```

Executar em desenvolvimento:

```bash
npm run start:dev
```

Outros scripts definidos no `package.json`:

```bash
npm run start:watch
npm run dist
npm run start:dist
```

O projeto foi configurado para escutar na porta `3000`. O arquivo `.env`
contém `PORT`, mas a aplicação não lê essa variável.

## H. Verificações realizadas

### TypeScript

Comando executado:

```bash
npx tsc --noEmit
```

Resultado: falha preexistente na integração entre o pacote `cors` importado e a
tipagem de plugins esperada pelo Fastify.

### Build

Comando executado:

```bash
npm run dist
```

Resultado: falha porque o módulo `cors` não está instalado, embora seja
importado por `src/server.ts`.

### Testes

Não existem testes automatizados nem script de testes configurado no projeto.

## I. Git e GitHub

- O diretório inicialmente não era um repositório Git.
- O repositório local foi inicializado na branch `main`.
- O repositório público foi criado com o nome `formula-one-api`.
- O remote `origin` foi configurado.
- O commit inicial de documentação foi criado com a mensagem:
  `docs: add project documentation`.
- O arquivo `.env` foi mantido fora do commit.
- `node_modules/` e `dist/` foram adicionados ao `.gitignore`.
- Nenhum `git push` foi executado.

## J. Limitações encontradas

1. A dependência de runtime `cors` está ausente do `package.json`.
2. O uso atual de `cors` não corresponde ao tipo de plugin esperado pelo Fastify.
3. O script `start:dist` aponta para `dist/src/index.js`, mas o arquivo de
   entrada existente é `src/server.ts`.
4. A variável `PORT` não é utilizada.
5. As rotas de listagem retornam apenas subconjuntos estáticos dos dados.
6. Há inconsistência na equipe associada a Lewis Hamilton entre endpoints.
7. Não há validação formal de parâmetros ou schemas de resposta.
8. Não há testes automatizados.
9. Não foi encontrado um arquivo de licença separado, embora o `package.json`
   informe licença `ISC`.

## K. Sugestões para uma interface web

### Proposta 1 — Dashboard básico

Primeira versão recomendada para portfólio.

- **Problema atendido:** apresentar os dados disponíveis de forma visual.
- **Endpoints:** `GET /teams/` e `GET /drivers/`.
- **Componentes:** cabeçalho, cards de equipes, cards de pilotos, estados de
  carregamento, erro e lista vazia.
- **Limitação:** as rotas de listagem atualmente retornam apenas um registro.
- **Tecnologia sugerida:** React, TypeScript e Vite.

### Proposta 2 — Explorador de pilotos

- **Problema atendido:** permitir consultar o detalhe de um piloto.
- **Endpoints:** `GET /drivers/` e `GET /drivers/:id`.
- **Componentes:** lista ou grid de pilotos, card detalhado, equipe associada,
  indicador de carregamento e estado de piloto não encontrado.
- **Dependências futuras:** corrigir a inconsistência dos dados e, idealmente,
  adicionar mais informações aos pilotos.

### Proposta 3 — Painel completo de equipes e pilotos

- **Problema atendido:** oferecer uma experiência mais rica de exploração da
  temporada.
- **Funcionalidades:** busca, filtros, páginas de detalhes, favoritos,
  estatísticas, histórico e tema claro/escuro.
- **Endpoints necessários:** `GET /teams/:id`, listagens completas, filtros,
  paginação e endpoints de estatísticas.
- **Status:** depende de evolução futura do backend.

## L. Próximos passos recomendados

1. Corrigir a dependência e a integração de CORS com Fastify.
2. Corrigir o script `start:dist`.
3. Usar `PORT` com fallback para `3000`.
4. Corrigir a inconsistência dos dados de pilotos e equipes.
5. Fazer as rotas de listagem retornarem os dados completos.
6. Adicionar schemas e validação de parâmetros.
7. Criar testes unitários e de integração.
8. Implementar o dashboard básico em React com estados de carregamento e erro.

