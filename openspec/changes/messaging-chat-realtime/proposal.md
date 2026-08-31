# Proposal: Implementação de Mensageria Direta e Chat em Tempo Real (`messaging-chat-realtime`)

## Summary
Implementar o sistema de mensageria direta 1:1 e chat interativo no **Frontend Cliente** e no **Android**, consumindo as queries, mutations e subscriptions do módulo GraphQL `messaging` (`directMessages`, `sendDirectMessage`, `markDirectMessageAsRead`, `Subscription.directMessageAdded`).

## Motivation & Background
Conforme diagnosticado no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md), a comunicação síncrona e troca de mensagens privadas entre profissionais e empresas é um pilar central da plataforma Workix (LinkedIn clone):
- Candidatos e recrutadores precisam conversar privadamente sobre oportunidades e processos seletivos.
- As mensagens devem oferecer atualização reativa de novas mensagens recebidas.
- Mensagens devem suportar marcação de leitura e histórico paginado da conversa.

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/messaging.service.ts`: Abstração de queries, mutations e subscriptions de mensagens.
  - `src/stores/messaging.ts`: Store Pinia com conversas ativas, mensagens trocadas e estado de leitura.
  - `src/views/MessagingView.vue` (`/messaging`): Interface de chat 2 colunas (lista de conversas à esquerda, histórico de chat e caixa de envio à direita).
  - Rota `/messaging` em `router/index.ts` e atalho "Mensagens" no `TheHeader.vue`.
- **Android App (`android/`)**:
  - `MessagingApiService.kt`: Camada de rede em Kotlin para queries e envio de mensagens.
  - `ChatListFragment.kt`: Listagem de conversas ativas.
  - `DirectChatActivity.kt`: Tela de conversa com balões de mensagem e input de texto.
