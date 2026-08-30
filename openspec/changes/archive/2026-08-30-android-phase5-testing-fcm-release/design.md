## Context

A Fase 5 encerra a migração do Frontend Cliente para Kotlin nativo no Android, fornecendo o serviço de notificações em segundo plano (FCM) e a suíte de validação e testes unitários.

## Goals / Non-Goals

**Goals:**
- Implementar `MyFirebaseMessagingService.kt` para suporte a notificações push em Kotlin.
- Criar a suíte de testes unitários para a camada de estado e modelo (`NetworkResultTest.kt`).
- Atualizar o manifesto Android para registrar os novos componentes Kotlin.
- Atualizar a matriz de progresso em `ANDROID_MIGRATION_PROGRESS.md` marcando 100% de conclusão das 5 fases.

**Non-Goals:**
- Não alterar regras de negócio dos endpoints de backend.

## Decisions

- **Decisão 1: Notificações com Canais Android O+ (NotificationChannel)**:
  O serviço FCM criará automaticamente o canal de notificações de alta prioridade para exibição correta a partir do Android 8.0 (API level 26).

- **Decisão 2: Testes Unitários com JUnit 4**:
  Utilização de JUnit 4 para validação rápida da lógica de estado em `NetworkResult`.

## Risks / Trade-offs

- [Falta do arquivo `google-services.json` configurado no ambiente local] → O `MyFirebaseMessagingService` deve validar a chave nula sem causar crash na inicialização do aplicativo.
