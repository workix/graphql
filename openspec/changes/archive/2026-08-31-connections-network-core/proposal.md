# Proposal: Implementação do Módulo de Conexões e Rede Profissional (`connections-network-core`)

## Summary
Implementar a infraestrutura completa de rede de contatos e conexões profissionais no **Frontend Cliente**, **Frontend Admin** e **Android**, consumindo as queries e mutations do módulo GraphQL `connections` (`myConnections`, `pendingConnectionRequests`, `sendConnectionRequest`, `acceptConnectionRequest`, `rejectConnectionRequest`, `followUser`, `unfollowUser`, `socialDistanceDegree`).

## Motivation & Background
A paridade identificada em `TODO.md` aponta a necessidade urgente de habilitar a experiência de *networking* profissional estilo LinkedIn na plataforma Workix:
- Os usuários precisam visualizar suas conexões ativas, aceitar/recusar solicitações pendentes de conexão e enviar novos convites para expandir sua rede.
- Os perfis e cards precisam exibir o grau de separação social (1º, 2º ou 3º grau).
- Usuários devem poder seguir outros profissionais (`followUser`/`unfollowUser`) para acompanhar suas postagens no feed mesmo sem conexão mútua formal.

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/connections.service.ts`: Queries e Mutations GraphQL para gestão de conexões e seguidores.
  - `src/stores/connections.ts`: Store reativa Pinia para controle de conexões, solicitações pendentes e sugestões.
  - `src/views/MyNetworkView.vue` (`/mynetwork`): Painel completo de rede com abas (Minhas Conexões, Convites Pendentes, Pessoas que Você Talvez Conheça).
  - Atualização do `TheHeader.vue` e `router/index.ts`.
- **Frontend Admin (`frontend/admin`)**:
  - `src/services/connections.service.ts`: Serviço administrativo para contagem e monitoramento de conexões na plataforma.
- **Android App (`android/`)**:
  - `ConnectionsApiService.kt`: Camada de rede em Kotlin com chamadas GraphQL para conexões e convites.
  - `ConnectionsFragment.kt` e `ConnectionAdapter`: Fragmento nativo para exibição de conexões e gestão de convites.
