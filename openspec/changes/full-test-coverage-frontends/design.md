# Design Técnico: Cobertura Completa de Testes Unitários para os Frontends Web

## 1. Arquitetura de Testes com Vitest

O **Vitest** é nativamente integrado com o Vite, aproveitando os mesmos plugins de compilação Vue 3 e TypeScript (`vite.config.ts`), eliminando a necessidade de reconfigurar transformadores Babel complexos.

### Estrutura de Arquivos de Teste

```
frontend/client/
  ├── vitest.config.ts
  └── src/
      ├── stores/__tests__/
      │   └── auth.spec.ts
      ├── services/__tests__/
      │   ├── api.spec.ts
      │   ├── media.service.spec.ts
      │   ├── jobs.service.spec.ts
      │   ├── resumes.service.spec.ts
      │   ├── posts.service.spec.ts
      │   ├── messaging.service.spec.ts
      │   ├── learning.service.spec.ts
      │   └── analytics.service.spec.ts
      └── components/__tests__/
          ├── JobCard.spec.ts
          ├── PostCard.spec.ts
          └── LoadingOverlay.spec.ts

frontend/admin/
  ├── vitest.config.ts
  └── src/
      ├── stores/__tests__/
      │   └── auth.spec.ts
      └── services/__tests__/
          ├── adminApi.spec.ts
          ├── mediaAdmin.service.spec.ts
          ├── jobs.service.spec.ts
          ├── resumes.service.spec.ts
          ├── companies.service.spec.ts
          ├── users.service.spec.ts
          ├── jaas.service.spec.ts
          ├── plans.service.spec.ts
          ├── stats.service.spec.ts
          └── forms.service.spec.ts
```

## 2. Estratégia de Isolamento e Mocking

- **Mock de Requisições HTTP**: As chamadas `fetch` e instâncias do Axios são mockadas usando `vi.fn()` ou `vi.spyOn(global, 'fetch')`, testando cenários de sucesso (payload GraphQL formatado com campo `data`), erro de rede (lançamento de exceções) e erros de validação GraphQL (campo `errors`).
- **Mock de LocalStorage e Navegação**: Mock de `localStorage` (`getItem`, `setItem`, `removeItem`) e `vue-router` (`useRouter`, `useRoute`).
- **Isolamento de Pinia**: Instanciação de `createPinia()` com `setActivePinia()` em cada teste para garantir isolamento de estado entre suítes.
