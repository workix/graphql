# firebase-auth-frontend-admin Specification

## Purpose
Define os requisitos e cenários de comportamento para a autenticação e autorização de administradores e operadores no Frontend Admin utilizando Firebase Authentication e verificação de papéis no backend GraphQL.

## Requirements

### Requirement: Autenticação Administrativa com Firebase
O Frontend Admin SHALL autenticar administradores e operadores utilizando o Firebase Auth SDK e validar as permissões de acesso com base nos registros do backend.

#### Scenario: Login de Administrador com Credenciais Válidas
- **WHEN** o administrador insere credenciais válidas na tela de login administrativo
- **THEN** o Firebase SDK autentica a conta, o frontend consulta o backend para confirmar os papéis administrativos (`ROLE_ADMIN` ou `ROLE_OPERATOR`) e concede acesso ao painel.

#### Scenario: Bloqueio de Usuário Sem Permissão Administrativa
- **WHEN** um usuário autenticado no Firebase não possui papéis de administração no backend
- **THEN** o frontend exibe alerta informando ausência de privilégios e impede o acesso ao painel administrativo.

### Requirement: Gerenciamento de Sessão e Proteção de Rotas Administrativas
O store `useAdminAuthStore` SHALL manter a sessão do administrador sincronizada, injetar o token em todas as consultas GraphQL administrativas e redirecionar usuários não autenticados para a tela de login.

#### Scenario: Tentativa de Acesso a Rota Protegida Sem Autenticação
- **WHEN** um usuário não autenticado tenta navegar diretamente para `/dashboard` ou telas de gestão
- **THEN** o router intercepta a navegação e redireciona para `/login` preservando a rota de destino.

#### Scenario: Desconexão Segura do Painel Administrativo
- **WHEN** o administrador clica no botão de logout no layout do painel
- **THEN** a sessão do Firebase é encerrada (`signOut`), os dados locais são limpos e o usuário é redirecionado para `/login`.
