## Context

A Fase 3 constrói os fluxos de Autenticação e Navegação do aplicativo nativo Android, aproveitando os clientes HTTP e DTOs desenvolvidos na Fase 2.

## Goals / Non-Goals

**Goals:**
- Implementar `SessionManager.kt` para gerenciar a persistência local da sessão (token JWT + perfil).
- Conectar o `ApiClient` ao `SessionManager` para injeção automática de tokens.
- Criar `AuthViewModel.kt` em Kotlin com LiveData/StateFlow e suporte a Coroutines (`viewModelScope`).
- Implementar as telas nativas `LoginActivity.kt` e `RegisterActivity.kt`.
- Implementar a `MainActivity.kt` com `BottomNavigationView` e os fragmentos base (`HomeFragment.kt`, `JobsListFragment.kt`, `CandidatesListFragment.kt`, `BlogListFragment.kt`).

**Non-Goals:**
- Não detalhar as telas de detalhe avançado ou formulários de criação de vaga/currículo nesta fase (serão implementadas na Fase 4).

## Decisions

- **Decisão 1: Persistência com `SharedPreferences` em `SessionManager`**:
  Usar `SharedPreferences` com serialização JSON dos dados do usuário para garantir acesso síncrono e simples ao token JWT para o `AuthInterceptor`.

- **Decisão 2: Arquitetura baseada em Single-Activity com Fragments para a Navegação Principal**:
  `MainActivity` atuará como host com um `BottomNavigationView` e contêiner `FrameLayout`, permitindo alternância instantânea entre as abas `Início`, `Vagas`, `Candidatos` e `Blog`.

## Risks / Trade-offs

- [Invalidação de Token expirado (401 Unauthorized)] → O `AuthInterceptor` e o `SessionManager` devem limpar a sessão e disparar evento para redirecionar à `LoginActivity`.
