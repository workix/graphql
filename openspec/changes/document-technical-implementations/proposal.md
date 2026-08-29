# Proposta: Mapeamento e Documentação de Implementações Técnicas Multi-Projeto

## Why

Atualmente o sistema é composto por 4 projetos interligados (`graphql`, `java-stack`, `workix-spring-boot` e `workix-frontend-vue`). Para tomar decisões estratégicas sobre novas implementações, migrações e correções de funcionalidades, é necessário varrer a estrutura de todos os 4 projetos e registrar com clareza o que já está implementado (arquitetura, módulos, endpoints, modelos, entidades, componentes de UI e testes) em um relatório unificado `IMPLEMENTAÇÕES_TECNICAS.md` na raiz do projeto pai (`graphql`).

## What Changes

- Varredura e análise técnica detalhada dos 4 projetos do ecossistema:
  - `graphql` (Projeto Pai / Novo Backend GraphQL em Node.js/Sequelize)
  - `java-stack` (Backend Legado em Java/JEE/WildFly)
  - `workix-spring-boot` (Segunda versão do Backend em Spring Boot)
  - `workix-frontend-vue` (Frontend da aplicação em Vue.js/Vite/TypeScript/Pinia)
- Criação do documento unificado `IMPLEMENTAÇÕES_TECNICAS.md` na raiz do projeto `graphql`.
- Consolidação do inventário técnico por projeto: stack tecnológica, estrutura de diretórios, entidades/modelos, endpoints/APIs, regras implementadas, divergências funcionais e lacunas para orientar decisões de desenvolvimento futuro.

## Capabilities

### New Capabilities
- `technical-implementations-report`: Capacidade de auditoria, análise comparativa e documentação centralizada do status de implementação técnica dos 4 projetos do ecossistema Workix/GraphQL.

### Modified Capabilities

(Nenhuma capacidade de spec existente modificada)

## Impact

- **Documentação**: Criação de `IMPLEMENTAÇÕES_TECNICAS.md` na raiz de `c:\Packsys\NetBeansProjects\graphql`.
- **Decisões de Engenharia**: Servirá de base técnica oficial para identificar paridade de recursos entre o legado Java, o backend Spring Boot, o novo backend GraphQL e o frontend Vue.
- **Projetos Afetados**:
  - `c:\Packsys\NetBeansProjects\graphql`
  - `C:\Packsys\NetBeansProjects\java-stack`
  - `C:\Packsys\NetBeansProjects\workix-spring-boot`
  - `C:\Packsys\NetBeansProjects\workix-frontend-vue`
