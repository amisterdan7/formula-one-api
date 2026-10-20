# Formula One API

API REST minimalista sobre Fórmula 1, construída com Node.js, TypeScript e Fastify. O projeto disponibiliza consultas em memória para equipes e pilotos.

## Sobre o projeto

Esta API serve como uma base simples para aplicações que precisam consultar dados básicos de Fórmula 1. Os dados são estáticos e ficam definidos no código-fonte; não há banco de dados nem integração com serviços externos.

## Tecnologias utilizadas

- Node.js 20 ou superior
- TypeScript 5.4
- Fastify 5
- `tsx` para execução em desenvolvimento
- `tsup` para compilação
- CORS (importado pela aplicação; a dependência de runtime ainda precisa ser adicionada ao projeto)

As versões exatas das dependências estão registradas em [`package.json`](./package.json) e [`package-lock.json`](./package-lock.json).

## Funcionalidades atuais

- Consulta de uma lista estática de equipes por meio de `GET /teams/`.
- Consulta de uma lista estática de pilotos por meio de `GET /drivers/`.
- Consulta de um piloto pelo identificador por meio de `GET /drivers/:id`.
- Associação, no detalhe do piloto, entre o piloto e sua equipe.
- CORS configurado para aceitar qualquer origem (`*`).

## Estrutura do projeto

```text
.
├── src/
│   ├── server.ts  # Inicialização do Fastify e definição das rotas
│   └── teams.ts   # Dados estáticos das equipes
├── package.json
├── package-lock.json
├── tsconfig.json
└── .env
```

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Instalação

```bash
npm install
```

> Observação: a implementação importa o pacote `cors`, mas ele não está listado nas dependências de `package.json`. É necessário corrigir essa dependência antes de executar ou compilar a aplicação com sucesso.

## Execução

O script de desenvolvimento configurado no projeto é:

```bash
npm run start:dev
```

O servidor foi programado para escutar na porta `3000`. Embora exista uma variável `PORT` no arquivo `.env`, o código atual não a utiliza.

O projeto também define:

```bash
npm run start:watch
npm run dist
npm run start:dist
```

Esses comandos devem ser revisados antes do uso em produção: a compilação atual falha porque `cors` não está instalado, e o caminho usado por `start:dist` (`dist/src/index.js`) não corresponde ao arquivo de entrada encontrado no projeto (`src/server.ts`).

## Endpoints da API

### `GET /teams/`

Retorna a resposta estática abaixo:

```json
[
  {
    "id": 1,
    "name": "Ferrari"
  }
]
```

Não recebe parâmetros nem corpo. A rota responde com HTTP `200`.

### `GET /drivers/`

Retorna a resposta estática abaixo:

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

Não recebe parâmetros nem corpo. A rota responde com HTTP `200`.

### `GET /drivers/:id`

Busca um piloto pelo parâmetro de rota `id`. Os pilotos disponíveis atualmente são:

| ID | Piloto | Equipe |
| ---: | --- | --- |
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

O parâmetro é convertido com `parseInt`; não existe validação de schema ou mensagem específica para formatos inválidos.

## Configurações e variáveis de ambiente

O arquivo `.env` contém a variável `PORT`, mas a implementação atual usa a porta fixa `3000` e não lê esse valor. Não há credenciais ou chaves de API necessárias.

O arquivo `.env` não deve ser versionado. Antes do primeiro commit, recomenda-se incluí-lo no `.gitignore`.

## Testes

Não há testes automatizados nem script de testes configurado em `package.json`.

As verificações realizadas durante a preparação deste projeto encontraram:

- `npx tsc --noEmit`: falha porque o pacote `cors` não é compatível com o tipo de plugin esperado pelo Fastify.
- `npm run dist`: falha porque o módulo `cors` não está instalado.

Esses são problemas existentes na configuração atual e não foram alterados nesta etapa.

## Melhorias futuras

As ideias abaixo são propostas, não funcionalidades disponíveis atualmente:

- Adicionar e configurar corretamente um plugin de CORS compatível com Fastify.
- Usar `PORT` com valor padrão para configurar a porta por ambiente.
- Fazer `/teams/` e `/drivers/` retornarem os arrays completos em vez de respostas estáticas parciais.
- Adicionar endpoints de detalhe para equipes.
- Adicionar validação de parâmetros e schemas de resposta.
- Persistir os dados em um banco de dados ou consumir uma fonte externa.
- Criar testes unitários e testes de integração.
- Adicionar paginação, filtros e busca.

## Licença

O `package.json` informa a licença `ISC`. Não foi encontrado um arquivo de licença separado no projeto.

## Autor

Não há autoria confirmada no código deste projeto.
