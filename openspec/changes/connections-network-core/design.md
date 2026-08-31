# Design Document: Conexões e Rede Profissional (`connections-network-core`)

## Context & Architectural Strategy

O módulo de conexões viabiliza o grafo social do ecossistema Workix. A arquitetura conecta:
1. **Backend GraphQL (`src/modules/connections`)**:
   - `myConnections(userId)`: Retorna os nós de conexão do usuário logado.
   - `pendingConnectionRequests(userId)`: Retorna solicitações pendentes recebidas.
   - `socialDistanceDegree(userId1, userId2)`: Calcula o menor caminho no grafo de conexões (1º grau = conexão direta, 2º grau = conexão de conexão, 3º grau = 3 passos).
   - Mutations de controle de convites (`sendConnectionRequest`, `acceptConnectionRequest`, `rejectConnectionRequest`) e relacionamentos unidirecionais (`followUser`, `unfollowUser`).

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/connections.service.ts`: Abstração GraphQL para chamadas de rede e relacionamento.
   - `src/stores/connections.ts`: Store Pinia mantendo listas reativas de conexões ativas, convites pendentes e contadores numéricos.
   - `src/views/MyNetworkView.vue` (`/mynetwork`): Layout em 3 colunas (Resumo da Rede à esquerda, Convites e Sugestões no centro, Dicas de Networking à direita).

3. **Android App (`android/`)**:
   - `ConnectionsApiService.kt`: Módulo de rede assíncrono com Kotlin Coroutines.
   - `ConnectionsFragment.kt`: Fragment com abas "Minhas Conexões" e "Convites", `RecyclerView` e `ConnectionAdapter`.

## UI/UX Design & Components

### Card de Convite de Conexão (`ConnectionRequestCard`)
- Foto de perfil / Avatar
- Nome completo e Headline profissional
- Grau de conexão estimado
- Botões: "Aceitar" (Primary Blue `#0284c7`) e "Ignorar" (Subtle Gray `#64748b`)

### Card de Conexão Ativa (`ConnectionCard`)
- Foto de perfil, Nome, Cargo e data de conexão
- Botão "Mensagem" (direciona para `/messaging`) e menu de ações (remover conexão).
