# technical-debt-resolution Specification

## Purpose
Estabelecer a conformidade e mitigação formal de todos os débitos técnicos pendentes no ecossistema Workix, garantindo guards seguros nos frontends, autorização administrativa estrita, live-updates em mensageria/notificações, navegação e FCM completos no Android, além de suíte de testes instrumentados e cobertura TDD robusta no backend.

## Requirements

### Requirement: Proteção segura de rotas por padrão nos Frontends
O sistema DEVE ativar o guard de rotas autenticadas (`requiresAuth: true`) por padrão em `frontend/admin` e `frontend/client`, a menos que explicitamente configurado `VITE_ENABLE_AUTH_GUARD=false` em cenários de testes automatizados dedicados.

#### Scenario: Acesso anônimo a rota restrita
- **WHEN** um usuário não autenticado tenta acessar `/dashboard` no Admin ou `/post-job` no Client sem credenciais válidas
- **THEN** o sistema DEVE redirecionar automaticamente para a tela de `/login` com o parâmetro de redirect preservado.

### Requirement: Validação estrita de papéis administrativos no Frontend Admin
O frontend de administração DEVE validar a sessão contra o backend GraphQL exigindo privilégios `ROLE_ADMIN` ou `ROLE_OPERATOR`, rejeitando a criação silenciosa de credenciais de teste em ambiente de produção.

#### Scenario: Tentativa de login administrativo com usuário sem role de admin
- **WHEN** um usuário com credenciais comuns ou sem privilégios tenta autenticar no Frontend Admin
- **THEN** o sistema DEVE rejeitar o acesso e exibir mensagem de erro apropriada sem conceder privilégios locais dummy.

### Requirement: Atualização em tempo real de mensagens e notificações no Frontend Client
O frontend de clientes DEVE sincronizar em tempo real ou através de polling contínuo as novas mensagens recebidas e notificações não lidas.

#### Scenario: Recebimento de nova mensagem direta
- **WHEN** um contato envia uma nova mensagem direta para o usuário logado
- **THEN** a tela de mensagens DEVE atualizar a conversa dinamicamente e incrementar o contador de notificações sem necessidade de recarregar a página manualmente.

### Requirement: Navegação e registro completo de telas no aplicativo Android
O aplicativo Android DEVE declarar todas as Activities no `AndroidManifest.xml` (incluindo `RecruitmentKanbanActivity` e `InterviewsActivity`) e fornecer pontos de acesso na interface principal para todas as funcionalidades do ecossistema.

#### Scenario: Abertura das telas de Kanban e Entrevistas no Android
- **WHEN** o usuário seleciona as opções de Gestão de Vagas/Kanban ou Entrevistas
- **THEN** o sistema operacional Android DEVE inicializar com sucesso as respectivas Activities sem lançar `ActivityNotFoundException`.

### Requirement: Sincronização resiliente de Token FCM renovado no Android
O serviço `MyFirebaseMessagingService` DEVE interceptar `onNewToken` e persistir/enviar o novo token ao backend GraphQL.

#### Scenario: Rotação de token push pelo Firebase
- **WHEN** o Firebase Cloud Messaging gera um novo token de registro
- **THEN** o aplicativo DEVE registrar o token no armazenamento de sessão e propagá-lo ao backend para garantir entrega de notificações.

### Requirement: Suíte de testes instrumentados no Android
O módulo Android DEVE conter suíte de testes instrumentados `androidTest/` cobrindo fluxos de inicialização e navegação via Espresso/JUnit.

#### Scenario: Execução de testes instrumentados de UI
- **WHEN** a suíte de testes instrumentados é executada no ambiente Android
- **THEN** os testes de UI DEVEM verificar a renderização de componentes críticos e validação de tela inicial.
