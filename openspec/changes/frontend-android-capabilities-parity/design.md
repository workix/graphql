## Context

O backend do projeto `graphql` possui 32 módulos de domínio cobrindo tanto as funcionalidades de recrutamento e seleção (Core Workix) quanto as capacidades sociais e de rede profissional (LinkedIn Clone). Atualmente, o Frontend Cliente (`frontend/client`), o Frontend Admin (`frontend/admin`) e o aplicativo Android (`android/`) cobrem integralmente o módulo legado (Jobs, Resumes, Companies, Blogs, Auth), mas possuem um grande conjunto de novas capabilities não implementadas ou parcialmente suportadas.

Para estruturar a evolução futura de forma organizada e mensurável, este design estabelece o mapeamento técnico completo, detalhando as lacunas, as tecnologias recomendadas para cada interface e a matriz que será persistida no documento central `TODO.md`.

## Goals / Non-Goals

**Goals:**
- Realizar o levantamento detalhado e exaustivo de 100% das capabilities do backend GraphQL (Queries, Mutations, Subscriptions, DTOs e Modelos) versus o que foi implementado nos frontends e no Android.
- Criar o documento `TODO.md` na raiz do projeto com formatação rica, tabelas comparativas, métricas de paridade e checklist operacional acionável dividido por plataforma e por domínio.
- Definir a arquitetura recomendada para a implementação das features pendentes:
  - Frontend Cliente: Vue 3 + Pinia + GraphQL Client / Apollo Subscriptions.
  - Frontend Admin: Vue 3 + Vuetify 3 + Pinia + GraphQL Client.
  - Android: Kotlin + Jetpack Architecture + Apollo Kotlin Client / Coroutines + Jetpack Compose / Navigation.

**Non-Goals:**
- Não inclui a implementação do código-fonte das telas nesta fase (esta etapa foca no levantamento, especificação, matriz de rastreabilidade e geração do `TODO.md`).
- Não altera regras de negócio no backend ou no banco de dados.

## Decisions

### Decisão 1: Estrutura do documento `TODO.md`
- **Escolha**: Dividir o `TODO.md` em:
  1. Visão Geral Executiva & Percentuais de Cobertura por Plataforma.
  2. Matriz Consolidada de Paridade Backend × Clientes (32 módulos).
  3. Checklist Detalhado de Pendências do Frontend Cliente (`frontend/client`).
  4. Checklist Detalhado de Pendências do Frontend Admin (`frontend/admin`).
  5. Checklist Detalhado de Pendências do Aplicativo Android (`android/`).
  6. Plano de Fases e Ondas de Implementação Prioritária (Roadmap).
- **Alternativa Considerada**: Criar documentos isolados dentro de cada subpasta (`frontend/client/TODO.md`, `android/TODO.md`). Rejeitada porque a visão unificada na raiz do projeto facilita a governança pelo arquiteto / maestro.

### Decisão 2: Protocolo de Comunicação e Tempo Real
- **Escolha**: Padronizar as novas features pendentes (Chat, Notificações, Feed) no consumo de GraphQL com suporte a WebSockets/Subscriptions para Frontend Web e Android.
- **Alternativa Considerada**: Criar novos endpoints REST ad-hoc. Rejeitada para preservar a arquitetura modular baseada em GraphQL estabelecida no projeto pai.

### Decisão 3: Categorização por Domínios Funcionais
- **Escolha**: Agrupar as 32 capabilities em 6 macro-domínios:
  1. *Core & Recrutamento* (Jobs, Resumes, Candidates, Companies, Selective Processes).
  2. *Social & Comunidade* (Posts, Reactions, Comments, Hashtags, Featured, Blogs, Authors, Testimonials).
  3. *Rede & Mensageria* (Connections, Follows, Direct Messages / Chat, Real-Time Subscriptions).
  4. *Perfil & Avaliação Profissional* (Profiles, Endorsements, Recommendations, Social Selling Index).
  5. *Comunidades, Eventos & Educação* (Groups, Events, Learning / LMS).
  6. *Monetização, Gestão & Governança* (Premium Subscriptions, Notifications, Analytics, Media Assets, Forms, JAAS, Users, Stats).

## Risks / Trade-offs

- **[Complexidade de Tempo Real]**: Subscriptions GraphQL para chat e notificações exigem servidor WebSocket ativo e tratamento de reconexão no cliente.
  → *Mitigação*: Usar fallback para polling inteligente / REST push quando a conexão WebSocket estiver indisponível.
- **[Fragmentação de Estilos no Cliente]**: O `frontend/client` utiliza o tema Jobseek enquanto o `frontend/admin` utiliza Vuetify 3.
  → *Mitigação*: Manter isolamento estrito de dependências em cada projeto frontend, respeitando as bibliotecas de UI adotadas.
- **[Migração Apollo no Android]**: Android atualmente usa Retrofit2 para chamadas REST.
  → *Mitigação*: Introduzir Apollo Kotlin de forma gradual e modularizada nas novas features (Social, Conexões, Chat), coexistindo temporariamente com os serviços Retrofit existentes.
