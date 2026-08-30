## 1. Auditoria e Levantamento do Backend GraphQL

- [x] 1.1 Inspecionar todos os schemas `.gql`, types, inputs e enums em `src/modules`
- [x] 1.2 Auditar todas as Queries e Mutations em `QUERIES.md` e `MUTATIONS.md`, verificando argumentos, tipos de retorno e suporte a paginação (`all*Paginated`)
- [x] 1.3 Mapear parâmetros obrigatórios, opcionais e validações de input em cada mutation

## 2. Mapeamento de Rastreabilidade para Frontends

- [x] 2.1 Mapear operações de Vagas, Processos Seletivos, Currículos e Notificações para o Frontend Cliente (`frontend/client`)
- [x] 2.2 Mapear operações de Gestão Administrativa, CRUDs, JAAS (usuários/perfis) e Estatísticas para o Frontend Admin (`frontend/admin`)
- [x] 2.3 Mapear operações de Candidato, Vagas, Processos Seletivos e Notificações para o Projeto Android (`android/`)
- [x] 2.4 Documentar a matriz completa de rastreabilidade (Operação GraphQL ➔ Projeto ➔ Rota/Tela ➔ Ação ➔ Estados de UI) em documento de referência
