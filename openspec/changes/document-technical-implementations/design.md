## Context

O ecossistema Workix é composto por 4 projetos distintos:
1. `graphql`: Novo backend em Node.js (Express, GraphQL, Apollo Server, Sequelize ORM). É o projeto pai e maestro da arquitetura.
2. `java-stack`: Backend legado em Java EE (WildFly, JPA/Hibernate, REST, EJB).
3. `workix-spring-boot`: Segunda versão / alternativa do backend em Java com Spring Boot.
4. `workix-frontend-vue`: Frontend web em Vue 3 (Vite, TypeScript, Pinia, Vue Router).

Atualmente, não existe um documento centralizado e atualizado detalhando o que exatamente está implementado em cada um dos 4 projetos, o que dificulta tomar decisões de implementação de novas rotas, migrações de dados, regras de negócio e paridade de features.

## Goals / Non-Goals

**Goals:**
- Realizar varredura completa da estrutura de arquivos, códigos-fonte, modelos de dados, endpoints/mutations e rotas frontend em todos os 4 projetos.
- Gerar o documento `IMPLEMENTAÇÕES_TECNICAS.md` na raiz do projeto `graphql`.
- Estruturar a documentação de forma analítica, destacando:
  - Stack tecnológica e arquitetura de cada projeto;
  - Entidades de dados / Tabelas / Schemas;
  - APIs, Controllers, REST endpoints, GraphQL Queries e Mutations;
  - Componentes do frontend e integração com APIs;
  - Matriz de paridade e lacunas técnicas entre o legado e a nova arquitetura.

**Non-Goals:**
- Alterar código de produção dos projetos durante esta fase de documentação.
- Excluir ou refatorar endpoints existentes.

## Decisions

- **Localização do Relatório**: O arquivo `IMPLEMENTAÇÕES_TECNICAS.md` será criado na raiz de `c:\Packsys\NetBeansProjects\graphql`, respeitando a regra de que este projeto é o "projeto PAI" (maestro).
- **Abordagem de Varredura**: Executar varredura estruturada utilizando ferramentas de inspeção de arquivos (`list_dir`, `grep_search`, `run_command` com PowerShell/dir/findstr/rg) em cada diretório de projeto.
- **Formato Markdown Rico**: Utilizar tabelas de paridade, listas hierárquicas e marcadores claros para facilitar o consumo da informação na tomada de decisões.

## Risks / Trade-offs

- **Extensão do Código Legado**: O projeto `java-stack` possui uma grande quantidade de arquivos Java.
  - *Mitigação*: Focar na identificação de Beans, Controllers, DAOs/Repositories, Entidades e Serviços principais.
- **Divergência entre Código e Especificação**: Podem existir divergências entre o código nos 4 projetos e o `SPECIFICATION.md`.
  - *Mitigação*: Sinalizar explicitamente no documento `IMPLEMENTAÇÕES_TECNICAS.md` qualquer inconsistência encontrada para posterior alinhamento com `SPECIFICATION.md`.
