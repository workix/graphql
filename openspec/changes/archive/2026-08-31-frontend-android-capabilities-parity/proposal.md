## Why

O backend do ecossistema Workix evoluiu substancialmente, englobando 32 módulos de domínio GraphQL e REST (desde o núcleo de vagas, currículos e processos seletivos legados até as capabilities avançadas de rede social profissional e LinkedIn clone, como Feed Social, Conexões, Mensageria Direta em tempo real, Notificações, Perfis Avançados, Endorsements, Grupos, Eventos, LMS/Learning, Monetização/Premium e Analytics).

Entretanto, as interfaces de usuário (**Frontend Cliente**, **Frontend Admin** e **Android**) implementaram apenas uma parte desse escopo. É necessário formalizar um levantamento completo, detalhado e estruturado das lacunas de paridade em um documento central [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) na raiz do projeto, além de especificar o roadmap de implementação para guiar as próximas fases de desenvolvimento com rastreabilidade OpenSpec e TDD.

## What Changes

- Levantamento exaustivo e inventário comparativo de 100% das capabilities do backend GraphQL/REST contra:
  - Frontend Cliente (`frontend/client` — Vue 3 + Pinia + Vite)
  - Frontend Administrativo (`frontend/admin` — Vue 3 + Vuetify 3)
  - Aplicativo Mobile Android (`android/` — Kotlin + Jetpack)
- Criação do documento [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) na raiz do projeto contendo a matriz de paridade, checklist de pendências por plataforma e plano tático por domínio de negócio.
- Especificação de requisitos funcionais e técnicos para as telas, stores, serviços e fluxos pendentes em cada interface.

## Capabilities

### New Capabilities
- `frontend-android-parity-survey`: Levantamento detalhado e inventário comparativo de paridade entre as capacidades do backend GraphQL e as implementações em Frontend Cliente, Frontend Admin e Android App, estabelecendo o documento TODO.md e roadmap de execução.

### Modified Capabilities
<!-- Nenhuma capability existente tem requisitos modificados; este levantamento adiciona a especificação de paridade dos clientes. -->

## Impact

- **Documentação e Roadmap**: Criação de `TODO.md` na raiz do projeto como documento de referência operacional.
- **Frontend Cliente (`frontend/client`)**: Mapeamento de 15+ novas views, stores e fluxos pendentes (Feed Social, Chat em Tempo Real, Conexões/Rede, Notificações, Cursos, Grupos, Eventos, Premium, SSI).
- **Frontend Admin (`frontend/admin`)**: Mapeamento das telas administrativas e de moderação pendentes (Moderação de Conteúdo Social, Blogs/Comentários, Gestão de Cursos LMS, Planos de Assinatura, Formulários de Contato, Autores/Membros).
- **Android App (`android/`)**: Mapeamento da evolução do cliente mobile de REST para consumo nativo GraphQL completo, adicionando telas sociais, chat em tempo real, notificações internas e perfil completo.
