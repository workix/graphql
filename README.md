<div align="center">

# 🚀 Workix GraphQL API

### O motor por trás da plataforma de empregos 100% gratuita do Brasil

**Backend de gestão de vagas, candidatos, currículos e processos seletivos — projetado para acabar de vez com o *over-fetching* e o *under-fetching*.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![GraphQL](https://img.shields.io/badge/GraphQL-15.x-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org)
[![Sequelize](https://img.shields.io/badge/Sequelize-5.x-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org)
[![Jest](https://img.shields.io/badge/Jest-TDD-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](./LICENSE)

[Sobre](#-sobre-o-projeto) •
[Para quem é](#-para-quem-é-este-projeto) •
[Arquitetura](#%EF%B8%8F-arquitetura) •
[Funcionalidades](#-módulos-e-funcionalidades) •
[Ecossistema](#-o-ecossistema-workix) •
[Como rodar](#-como-rodar-o-projeto) •
[Testes](#-testes) •
[Documentação](#-documentação-completa)

</div>

---

## 💡 Sobre o Projeto

O **Workix GraphQL API** é o **novo backend (projeto maestro 🎼)** da plataforma **Workix** — uma rede profissional e plataforma de recrutamento enxuta, feita para conectar quem contrata a quem procura.

A Workix adota um modelo sustentável de **acesso e visibilidade** (com planos B2B para empresas e vagas patrocinadas identificadas), diferenciando-se radicalmente dos concorrentes tradicionais por salvaguardas rigorosas de transparência e integridade pública.

### 📜 Os 5 Pactos da Workix

1. **Participar é sempre gratuito**: Criar perfil, candidatar-se, publicar uma vaga ativa e buscar no resultado orgânico não custam nada, para ninguém.
2. **Toda visibilidade paga é identificada, sempre**: Vagas em destaque ou perfis impulsionados aparecem com rótulo visível e imutável (`is_sponsored = true`, `sponsor_label = 'Patrocinada'`). Conteúdo pago nunca é disfarçado de resultado orgânico.
3. **Ninguém desaparece por não pagar**: O resultado orgânico é sempre preservado e ordenado pela fórmula aberta de relevância ([`RANKING.md`](./RANKING.md)). Pagar compra posições adicionais demarcadas, nunca o lugar do orgânico.
4. **Seu contato só é liberado com seu consentimento**: Dados de contato direto nunca são entregues silenciosamente. O candidato controla suas chaves de visibilidade ([`PRIVACY.md`](./PRIVACY.md)) e é sempre notificado sobre desbloqueios de contato.
5. **Sem vaga fantasma**: Toda vaga possui validade/expiração obrigatória (`expires_at`), desfecho compulsório, e a taxa de resposta da empresa nos últimos 90 dias é calculada e exibida publicamente.

### 🏛️ Governança Open Core & Licenciamento

- **Núcleo Aberto (AGPLv3)**: Perfis, busca orgânica com fórmula auditável, candidaturas, kanban, mensageria e middlewares de proteção de privacidade. Ver [`SELF-HOSTING.md`](./SELF-HOSTING.md) e [`CLA.md`](./CLA.md).
- **Proteção de Marca**: A marca "Workix" e logotipos são protegidos. Ver [`TRADEMARK.md`](./TRADEMARK.md).
- **Módulos Comerciais (Enterprise)**: Motor de alocação de leilão de anúncios e faturamento avançado são mantidos em repositório proprietário para financiar a sustentabilidade do ecossistema.

### 🎯 Problema que resolvemos

Sistemas tradicionais de recrutamento sofrem com:
- 🐌 Problemas de performance N+1 em relacionamentos (candidaturas, currículos, comentários)
- 📦 *Over-fetching* / *under-fetching* de dados entre clientes Web e Mobile
- 🔗 Acoplamento forte entre endpoints REST específicos por cliente
- 🔔 Falta de padronização em notificações e atualizações de status
- 👻 Proliferação de vagas fantasmas e opacidade na venda de visibilidade

O Workix GraphQL resolve tudo isso com uma **API declarativa única**, otimizada, auditável e transparente.

---

## 👥 Para quem é este projeto

| Perfil | O que encontra na plataforma |
| :--- | :--- |
| 🧑‍💼 **Candidatos** | Buscam vagas, gerenciam currículos (experiências, formação, habilidades), se inscrevem em processos seletivos e recebem notificações em tempo real |
| 🏢 **Empresas / Recrutadores** | Publicam vagas, gerenciam processos seletivos, avaliam candidatos e acompanham estatísticas de candidatura |
| ✍️ **Autores / Editores** | Publicam conteúdo institucional no módulo de Blog (posts, categorias, tags, comentários moderados) |
| 🛡️ **Administradores (JAAS)** | Controlam papéis, permissões e usuários administrativos do sistema |

---

## 🏗️ Arquitetura

Monólito modular sobre **Node.js + Express**, com **Repository Pattern** por módulo de domínio e **middlewares composáveis** (`compose(authResolver, verifyTokenResolver)`) para autorização de resolvers.

```mermaid
flowchart LR
    subgraph Clientes ["💻 Clientes"]
        Web["Vue.js Web App"]
        Mobile["App Mobile Android"]
        Playground["GraphiQL Playground"]
    end

    subgraph API ["⚙️ Workix GraphQL API"]
        JWT["🔐 JWT Middleware"]
        Schema["📜 Schemas & Resolvers"]
        Loader["⚡ DataLoader (Batching)"]
    end

    subgraph Persist ["🗄️ Persistência & Cache"]
        DB[("Sequelize ORM<br/>MySQL / PostgreSQL")]
        Redis[("🔴 Redis Cache")]
        ES[("🔎 Elasticsearch")]
    end

    subgraph Async ["📡 Serviços Assíncronos"]
        MQ["🐇 RabbitMQ (notifications)"]
        FB["🔥 Firebase Auth"]
    end

    Web --> JWT
    Mobile --> JWT
    Playground --> JWT
    JWT --> Schema
    Schema <--> Redis
    Schema --> MQ
    Schema --> FB
    Schema --> Loader
    Loader --> DB
    Schema -.-> ES
```

### 🧰 Stack Tecnológica

| Camada | Tecnologia | Papel |
| :--- | :--- | :--- |
| **Linguagem** | TypeScript / Node.js | Tipagem estática + runtime |
| **Servidor** | Express | HTTP server & middleware runner |
| **API** | `express-graphql` / `graphql` / `graphql-tools` | Schemas `.gql` + fusão dinâmica de resolvers |
| **Batching** | `DataLoader` / `graphql-fields` | Elimina N+1 e extrai apenas os campos pedidos |
| **ORM** | Sequelize / Sequelize CLI | MySQL / PostgreSQL |
| **Cache** | `ioredis` | Sessões e listagens de alta performance |
| **Mensageria** | `amqplib` (RabbitMQ) | Fila de notificações assíncronas |
| **Auth** | `jsonwebtoken` / `bcrypt` | Tokens JWT + hash de senha |
| **Busca** | `@elastic/elasticsearch` | Indexação e busca avançada |
| **Real-time** | `graphql-ws` / `graphql-subscriptions` | Subscriptions via WebSocket |
| **Testes** | Jest + `ts-jest` (TDD) | Testes unitários e de integração |

---

## 📦 Módulos e Funcionalidades

O backend organiza suas regras de negócio em **módulos de domínio** dentro de `src/modules/`:

<table>
<tr>
<td valign="top" width="33%">

**👤 Identidade & Acesso**
- `auth` — Login (`doLogin`) e emissão de JWT
- `users` — Contas base, Firebase UUID
- `jaas` — Usuários e papéis administrativos
- `profiles` — Perfis públicos

**💼 Carreira & Recrutamento**
- `candidates` — Perfis de candidatos (+cache Redis)
- `resumes` — Currículos, experiências, formação, skills
- `jobs` / `job_postings` — Vagas + Match Score
- `selective_processes` — Processos seletivos com limite de vagas

</td>
<td valign="top" width="33%">

**🏢 Empresas**
- `companies` — Dados corporativos e mídias
- `members` — Equipe organizacional
- `testimonials` — Depoimentos corporativos
- `featured` — Itens em destaque

**🤝 Rede & Engajamento**
- `connections` — Conexões entre perfis
- `endorsements` — Endossos e recomendações
- `messaging` — Mensagens diretas
- `notifications` — Notificações assíncronas

</td>
<td valign="top" width="33%">

**📰 Conteúdo**
- `blogs` / `authors` — Posts, categorias, tags
- `posts` — Publicações e comentários aninhados
- `media` — Gestão de mídias

**🛠️ Suporte & Operações**
- `forms` — Formulários de contato
- `subscribers` — Newsletter
- `stats` — Métricas globais do sistema
- `others` — Utilitários (ex: validação de CPF)

</td>
</tr>
</table>

### ✨ Destaques de regras de negócio

- 🔐 **Auth Guard**: resolvers sensíveis são protegidos por `compose(authResolver, verifyTokenResolver)` — sem token válido, sem dado.
- 🔴 **Cache inteligente**: candidatos são espelhados no Redis (`candidate-${id}`) para leituras ultrarrápidas em `allCandidatesRedis`.
- 🐇 **Notificações assíncronas**: `notifyCandidate` publica na fila `notifications` do RabbitMQ, desacoplando envio de e-mail/push da resposta GraphQL.
- 📅 **Processos seletivos com regras**: inscrição valida vigência (`starts_in`/`expires_in`) e limite de vagas (`max_candidates`).
- 🌳 **Comentários em árvore otimizados**: `commentsParentLoader` resolve threads de comentários aninhados em lote, sem N+1.

> Consulte o [`SPECIFICATION.md`](./SPECIFICATION.md) para o detalhamento completo de cada regra de negócio (BR-001 a BR-007+) e casos de uso.

---

## 🌐 O Ecossistema Workix

Este repositório é o **Projeto Pai (Maestro 🎼)** que coordena 4 projetos interdependentes, garantindo paridade funcional entre o backend legado e a nova arquitetura:

```
                         ┌─────────────────────────────────┐
                         │      workix-frontend-vue         │
                         │   (Vue 3 + Vuex + Vue Router)    │
                         └────────────────┬──────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
┌───────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────┐
│  🎯 graphql (aqui)     │   │    workix-spring-boot     │   │      java-stack       │
│  Node.js + GraphQL     │   │  Spring Boot + REST       │   │  Java EE + WildFly    │
│  PROJETO MAESTRO       │   │  SEGUNDA VERSÃO           │   │  BACKEND LEGADO       │
└───────────────────────┘   └───────────────────────────┘   └───────────────────────┘
```

| Projeto | Papel | Stack |
| :--- | :--- | :--- |
| 🎯 **`graphql`** | Projeto pai / novo backend (este repositório) | Node.js, TypeScript, GraphQL |
| 🕰️ **`java-stack`** | Backend legado, fonte histórica das regras de negócio | Java EE, WildFly |
| 🔁 **`workix-spring-boot`** | Segunda versão alternativa do backend | Spring Boot 2, REST |
| 🖥️ **`workix-frontend-vue`** | Frontend web da plataforma | Vue 3, Vuex, Vue Router |

A matriz completa de paridade técnica entre os 4 projetos está documentada em [`IMPLEMENTAÇÕES_TECNICAS.md`](./IMPLEMENTAÇÕES_TECNICAS.md).

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) `v18+`
- [Docker](https://www.docker.com) e Docker Compose (para Postgres, Redis, Elasticsearch, Kibana e RabbitMQ)

### 1️⃣ Suba a infraestrutura

```bash
docker-compose up -d
```

Isso levanta:

| Serviço | Porta | Descrição |
| :--- | :--- | :--- |
| 🐘 PostgreSQL | `5432` | Banco de dados relacional |
| 🔴 Redis | `6379` | Cache distribuído |
| 🔎 Elasticsearch | `9200` | Indexação e busca |
| 📊 Kibana | `5601` | Visualização do Elasticsearch |
| 🐇 RabbitMQ | `5672` / `15672` | Fila de mensagens + painel de gestão |

### 2️⃣ Configure as variáveis de ambiente

Copie `.env.default` para `.env` e ajuste os valores:

```env
JWT_SECRET=<sua-chave-secreta>
RABBITMQ_SERVER_HOST=amqp://admin:admin@localhost:5672
ELASTIC_SEARCH_HOST=http://localhost:9200
```

> ⚠️ **Nunca** commite segredos reais, senhas ou certificados no código-fonte.

### 3️⃣ Instale as dependências

```bash
npm install
```

### 4️⃣ Rode as migrações e seeds

```bash
npm run migrate
npm run seed
```

### 5️⃣ Suba a API em modo desenvolvimento

```bash
npm start
```

A API sobe com hot-reload (`ts-node-dev`) e expõe a interface **GraphiQL** para exploração interativa do schema.

### 📜 Scripts disponíveis

| Script | Descrição |
| :--- | :--- |
| `npm start` | Sobe o servidor em modo desenvolvimento (hot-reload) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm run serve` | Roda a versão compilada (`dist/index.js`) |
| `npm run typecheck` | Verifica tipos sem gerar output |
| `npm run lint` | Executa o ESLint sobre `src/` |
| `npm test` | Executa a suíte de testes com cobertura |
| `npm run create` / `drop` | Cria / remove o banco de dados |
| `npm run migrate` | Executa as migrations do Sequelize |
| `npm run seed` | Popula o banco com dados iniciais |

---

## 🧪 Testes

O projeto segue **TDD (Test-Driven Development)** — testes são escritos antes da implementação.

```bash
npm test
```

- Framework: **Jest** + **ts-jest**
- Cobertura configurada em `jest.config.js` (relatórios em `text`, `lcov`, `clover`, `json`)
- Suítes organizadas por domínio em `tests/unit/modules/*`, com testes adicionais de resolvers, dataloaders, subscriptions e workers

---

## 📚 Documentação Completa

| Documento | Conteúdo |
| :--- | :--- |
| [`SPECIFICATION.md`](./SPECIFICATION.md) | 📘 **Fonte da verdade** — visão geral, arquitetura, regras de negócio, casos de uso e modelo de domínio |
| [`SPECIFICATION_LINKEDIN.md`](./SPECIFICATION_LINKEDIN.md) | Especificação do módulo estilo rede profissional (conexões, endossos) |
| [`IMPLEMENTAÇÕES_TECNICAS.md`](./IMPLEMENTAÇÕES_TECNICAS.md) | Auditoria e matriz de paridade entre os 4 projetos do ecossistema |
| [`MODELS.md`](./MODELS.md) | Checklist de entidades/modelos Sequelize implementados |
| [`TABLES.md`](./TABLES.md) | Estrutura de tabelas do banco de dados |
| [`RELATIONS.md`](./RELATIONS.md) | Relacionamentos entre entidades |
| [`QUERIES.md`](./QUERIES.md) | Catálogo de queries GraphQL disponíveis |
| [`MUTATIONS.md`](./MUTATIONS.md) | Catálogo de mutations GraphQL disponíveis |
| [`REST_ENDPOINTS.md`](./REST_ENDPOINTS.md) | Endpoints REST remanescentes (compatibilidade) |
| [`AGENTS.md`](./AGENTS.md) | Regras para agentes de IA que trabalham neste repositório |
| [`KNOW_ISSUES.md`](./KNOW_ISSUES.md) | Registro de issues conhecidas e contexto para reprodução |

---

## 🔒 Segurança

- 🔑 Autenticação via **JWT** assinado, vinculado a **Firebase Auth**
- 🚫 Segredos e certificados **nunca** devem ser commitados — use variáveis de ambiente
- 🛡️ Resolvers sensíveis protegidos por **Auth Guard** composável
- 📢 Alterações estruturais no banco de dados exigem aviso e aprovação prévios (ver [`CLAUDE.md`](./CLAUDE.md))

---

## 📄 Licença

Distribuído sob a licença **GNU General Public License v3.0**. Veja [`LICENSE`](./LICENSE) para mais detalhes.

---

## 👨‍💻 Desenvolvedor

**Felipe Rodrigues Michetti** — *Main Developer*

---

<div align="center">

**No more Underfetch or Overfetched Queries.** 🎯

Feito com 💚 para tornar a busca por emprego mais justa e transparente.

</div>
