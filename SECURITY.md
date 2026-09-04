# Workix - Diretrizes de Segurança e Conformidade (LGPD)

Este documento estabelece as políticas de segurança da informação, privacidade de dados e conformidade da plataforma Workix.

---

## 1. Autenticação e Autorização

- **Autenticação Baseada em Tokens**:
  - Uso de JSON Web Tokens (JWT) com verificação de assinatura e expiração.
  - Chaves secretas armazenadas exclusivamente em variáveis de ambiente (`JWT_SECRET`).
- **Princípio do Menor Privilégio**:
  - Funções (*Roles*) e Permissões granulares mapeadas para cada tipo de usuário (`ADMIN`, `COMPANY_ADMIN`, `CANDIDATE`, `RECRUITER`, `USER`).
  - Motor de *Entitlements* (`can(organizationId, featureKey, quantity)`) validando limites de planos antes da execução de operações de negócios.

---

## 2. Isolamento de Dados e Multi-Tenant

- **Isolamento Lógico**:
  - Dados sensíveis e configurações visuais são vinculados estritamente ao identificador do cliente (`tenant_id` / `tenant_slug`).
  - Impossibilidade de vazamento cruzado de configurações entre diferentes tenants.

---

## 3. Conformidade com a LGPD (Lei Geral de Proteção de Dados)

- **Minimização de Dados**:
  - Coleta apenas das informações necessárias para a prestação do serviço.
- **Privacidade e Consentimento de Candidatos**:
  - Candidatos possuem controle granular de visibilidade através da tabela `visibility_settings` e do serviço `reveal()`.
  - Perfis anônimos protegem nome, e-mail e telefone até o desbloqueio explícito ou candidatura.
- **Rastreabilidade e Auditoria**:
  - Logs de auditoria para transações financeiras (`billing_audit_logs`) e visualizações de perfil (`profile_views`).

---

## 4. Proteção de APIs e Comunicação

- **Criptografia em Trânsito**:
  - Todo o tráfego deve trafegar obrigatoriamente sob HTTPS / TLS 1.3.
- **Formatação de Erros sem Vazamento Técnico**:
  - Formatador centralizado mascara detalhes de implementação de banco de dados e stack traces para o consumidor final.
- **Prevenção de Duplicidade (Idempotência)**:
  - Suporte ao cabeçalho `Idempotency-Key` para operações financeiras e mutações de estado crítico.
