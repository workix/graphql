## Context

O backend GraphQL opera em `http://localhost:4000/graphql` com mais de 30 módulos de domínio (jobs, selective_processes, users, candidates, companies, forms, jaas, blogs, testimonials, etc.), suportando paginação, filtros e relações via DataLoaders.
Os clientes alvo compreendem três ecossistemas distintos:
1. `frontend/client`: Aplicação Vue.js 3 + Vite + CSS Jobseek voltada ao candidato e empregador.
2. `frontend/admin`: Aplicação Vue.js 3 + Vite + Vuetify 3 voltada à gestão administrativa completa.
3. `android`: Aplicação nativa Android (Kotlin / Jetpack Compose / Architecture Components) consumindo a mesma API.

Veja `proposal.md` para motivação e justificativas.

## Goals / Non-Goals

**Goals:**
- Elaborar o inventário completo e exaustivo de todas as queries e mutations do backend GraphQL.
- Construir a matriz de rastreabilidade mapeando cada operação para as telas de Client, Admin e Android.
- Definir o padrão arquitetural de consumo GraphQL nos frontends com isolamento de camada de API e tipagem.
- Documentar os fluxos de paginação (`all*Paginated`), filtros e mutations com seus respectivos inputs.

**Non-Goals:**
- Não implementar código de componentes ou telas nesta etapa (escopo de análise e especificação).
- Não alterar regras de negócio do backend GraphQL.
- Não implementar autenticação Firebase nesta etapa (conforme diretriz explícita).

## Decisions

### 1. Centralização da Auditoria em Documento de Referência
- **Decisão**: Gerar documentação técnica detalhada (`FRONTEND_GRAPHQL_MAPPING.md` ou seções estruturadas) catalogando todas as queries, mutations, tipos e suas respectivas telas no Cliente, Admin e Android.
- **Alternativas consideradas**: Manter apenas comentários dispersos nos arquivos de configuração; descartado por inviabilizar auditoria de cobertura completa.

### 2. Estratégia de Mapeamento por Domínio Funcional
- **Decisão**: Agrupar as operações por módulos de domínio:
  - *Oportunidades & Recrutamento*: Jobs, Selective Processes, Candidates, Resumes.
  - *Organizações & Usuários*: Companies, Users, Members, JAAS (Roles & Permissions).
  - *Conteúdo & Comunidade*: Blogs, Comments, Testimonials, Posts, Messaging, Notifications.
  - *Formulários & Configurações*: Forms, Stats, Subscribers.
- **Alternativas consideradas**: Mapeamento puramente alfabético; descartado porque o agrupamento por domínio facilita a implementação incremental das telas.

### 3. Diretriz de Consumo Real sem Mock
- **Decisão**: Estabelecer a regra estrita de que todas as telas implementadas devem consumir o endpoint GraphQL real em `http://localhost:4000/graphql`, banindo o uso de arrays estáticos mockados.
- **Alternativas consideradas**: Permitir mocks temporários; descartado pois mascara ausências de endpoints e gera débito técnico.

## Risks / Trade-offs

- [Risco: Operações com inputs complexos ou tipos aninhados não previstos nos formulários] ➔ Mitigação: Catalogação exata dos inputs GraphQL gerados pelo backend para guiar a criação dos formulários.
- [Risco: Discrepância entre necessidades visuais do template Jobseek e dados do GraphQL] ➔ Mitigação: Mapear campos existentes e criar DTOs/adapters no frontend para harmonizar dados da API com os componentes visuais.
