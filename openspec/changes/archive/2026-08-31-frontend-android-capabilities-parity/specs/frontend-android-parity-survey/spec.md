## Purpose

Define a rastreabilidade e os requisitos de cobertura e paridade entre as capacidades do backend GraphQL e as interfaces Frontend Cliente, Frontend Admin e Android App, estabelecendo o inventário completo no arquivo TODO.md.

## ADDED Requirements

### Requirement: Inventário Centralizado de Paridade e Documento TODO.md
O sistema SHALL disponibilizar na raiz do projeto um documento `TODO.md` detalhado contendo a relação exaustiva de todas as funcionalidades, queries, mutations, subscriptions e fluxos implementados no backend GraphQL em contraste com o status de implementação no Frontend Cliente, Frontend Admin e Android App.

#### Scenario: Consulta ao documento TODO.md
- **WHEN** um desenvolvedor ou arquiteto abrir o arquivo `TODO.md` na raiz do projeto
- **THEN** o documento deve apresentar uma matriz comparativa completa, status de implementação por plataforma (Concluído, Parcial, Pendente) e checklist acionável por módulo de domínio.

### Requirement: Cobertura Funcional do Frontend Cliente
O Frontend Cliente (`frontend/client`) SHALL fornecer interfaces e fluxos para consumo das capacidades sociais e profissionais do backend (Feed Social, Postagens, Reações, Comentários, Conexões, Mensageria Direta em tempo real, Notificações persistentes, Perfil Avançado, Cursos/LMS, Grupos, Eventos, Assinatura Premium e Índice SSI).

#### Scenario: Visualização do Feed Social e Interações
- **WHEN** o usuário autenticado acessar o portal do cliente Web
- **THEN** o sistema deve permitir visualizar postagens do feed social ordenadas ou ranqueadas, reagir a posts, comentar e criar novas postagens com mídia e menções.

#### Scenario: Mensageria Direta e Chat em Tempo Real
- **WHEN** o usuário navegar para a seção de mensagens
- **THEN** o sistema deve carregar as conversas diretas e sincronizar o recebimento de novas mensagens via GraphQL Subscription.

### Requirement: Cobertura Funcional do Frontend Admin
O Frontend Admin (`frontend/admin`) SHALL fornecer visões de dados e moderação para todas as entidades do sistema (Moderação de Posts Sociais, Comentários de Blogs e Posts, Gestão de Cursos e Aulas LMS, Formulários de Contato, Autores, Membros da Equipe, Processos Seletivos e Planos de Assinatura Premium).

#### Scenario: Moderação de Conteúdo Social e LMS
- **WHEN** o administrador acessar o painel administrativo
- **THEN** o sistema deve disponibilizar telas construídas em Vuetify 3 para auditoria de postagens sociais, moderação de comentários, criação de cursos e gestão de planos de assinatura.

### Requirement: Cobertura Funcional do Aplicativo Android
O aplicativo móvel Android (`android/`) SHALL implementar clientes nativos em Kotlin para as operações GraphQL avançadas, provendo telas para Feed Social, Chat em Tempo Real, Centro de Notificações interno, Perfil Profissional completo com Open to Work e recomendações.

#### Scenario: Acesso ao Feed e Notificações no Mobile
- **WHEN** o usuário abrir o aplicativo Android
- **THEN** o aplicativo deve exibir o feed social com suporte a reações, carregar notificações persistentes com contagem de não-lidas e permitir a troca de mensagens diretas.
