## Context

Com os padrões de transporte e a primeira funcionalidade implementados, a Etapa 4 expande a arquitetura para todos os domínios restantes.
A arquitetura modular deve espelhar a estrutura de módulos do backend:
- `src/services/companies.service.ts`
- `src/services/resumes.service.ts`
- `src/services/candidates.service.ts`
- `src/services/selectiveProcesses.service.ts`
- `src/services/blogs.service.ts`
- `src/services/testimonials.service.ts`
- `src/services/forms.service.ts`
- `src/services/users.service.ts`
- `src/services/jaas.service.ts`
- `src/services/stats.service.ts`

Veja `proposal.md` para motivação e justificativas.

## Goals / Non-Goals

**Goals:**
- Implementar todas as views e fluxos restantes no Frontend Cliente com estilos do Jobseek e reatividade.
- Implementar todos os CRUDs com tabelas, modais e formulários com validação no Frontend Admin.
- Implementar as telas e repositórios correspondentes no aplicativo Android.
- Garantir que todos os estados de carregamento, erros e feedback de usuário estejam implementados de forma uniforme.
- Manter o pipeline de build e testes verde em todos os projetos.

**Non-Goals:**
- Não alterar schemas no backend.
- Não introduzir mocks ou dados estáticos de fallback para mascarar ausência de endpoints.

## Decisions

### 1. Camada de Serviços Padronizada
- **Decisão**: Cada módulo de negócio terá seu próprio service tipado exportando métodos assíncronos que invocam `graphqlClient.request<T>(query, variables)`.
- **Alternativas consideradas**: Concentrar todas as queries em um único arquivo gigante; descartado para evitar acoplamento e facilitar a divisão de trabalho.

### 2. Padrão de Tabela e Formulário no Admin
- **Decisão**: No Frontend Admin, utilizar componentes base reutilizáveis (`DataTable`, `EntityDialog`, `ConfirmDeleteDialog`) encapsulando `v-data-table` e formulários com validação do Vuetify.
- **Alternativas consideradas**: Escrever formulários do zero em cada view; descartado pela duplicação de código.

### 3. Padrão de Repositório e ViewModels no Android
- **Decisão**: Criar repositórios específicos por domínio (`CompanyRepository`, `ResumeRepository`, `BlogRepository`) injetados nos respectivos `ViewModels`, com `StateFlow` / `LiveData` emitindo estados `Loading`, `Success(data)` e `Error(message)`.

## Risks / Trade-offs

- [Risco: Grande volume de arquivos e telas] ➔ Mitigação: Execução incremental módulo a módulo com commits atômicos (ex: módulo de empresas, módulo de currículos, módulo de blog, etc.).
- [Risco: Formulários com campos opcionais ou estruturas complexas] ➔ Mitigação: Respeitar estritamente a tipagem gerada/definida nos schemas `.gql` do backend.
