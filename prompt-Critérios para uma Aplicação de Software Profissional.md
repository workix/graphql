# Critérios para uma Aplicação de Software Profissional

## 1. Objetivo

Uma aplicação de software profissional deve ser projetada para funcionar de maneira **confiável, segura, escalável, observável, manutenível e preparada para evolução**.

Não basta que a aplicação execute suas funcionalidades principais. Ela deve possuir uma arquitetura capaz de suportar:

- Uso real por múltiplos usuários;
- Crescimento da quantidade de dados;
- Crescimento da quantidade de usuários;
- Falhas de infraestrutura;
- Falhas de integração;
- Atualizações e novas versões;
- Diferentes ambientes;
- Requisitos de segurança;
- Auditoria e rastreabilidade;
- Monitoramento operacional;
- Recuperação de falhas;
- Manutenção por diferentes desenvolvedores;
- Integração com outros sistemas.

Este documento define os principais requisitos que devem ser considerados para classificar uma aplicação como profissional.

---

# 2. Arquitetura

## 2.1 Estrutura organizada

O projeto deve possuir uma arquitetura clara, com responsabilidades bem definidas.

Exemplo:

```text
Frontend
    ↓
API / Gateway
    ↓
Controllers / Resolvers
    ↓
Services
    ↓
Repositories
    ↓
Database
```

Cada camada deve possuir uma responsabilidade específica.

Evitar:

- Regra de negócio dentro de controllers;
- SQL espalhado pelo código;
- Acesso direto ao banco pelo frontend;
- Código duplicado;
- Dependências desnecessárias entre módulos.

---

# 3. Separação de responsabilidades

A aplicação deve aplicar princípios como:

- Single Responsibility Principle;
- Separation of Concerns;
- Dependency Injection;
- Encapsulamento;
- Baixo acoplamento;
- Alta coesão.

Cada módulo deve possuir uma responsabilidade clara.

---

# 4. Código

O código deve ser:

- Legível;
- Padronizado;
- Testável;
- Documentado quando necessário;
- Sem duplicações desnecessárias;
- Sem código morto;
- Sem credenciais hardcoded;
- Sem configurações específicas de ambiente no código.

## 4.1 Padrões

O projeto deve possuir padrões definidos para:

- Nomenclatura;
- Estrutura de pacotes;
- Tratamento de exceções;
- Logs;
- APIs;
- DTOs;
- Validações;
- Persistência;
- Testes.

---

# 5. Configuração

As configurações da aplicação devem ser externas ao código.

Exemplos:

```text
DATABASE_URL
DATABASE_USER
DATABASE_PASSWORD
JWT_SECRET
API_URL
SMTP_HOST
```

Nunca armazenar:

```text
senha
token
secret
certificado
chave privada
```

diretamente no código-fonte.

---

# 6. Ambientes

A aplicação deve possuir separação entre ambientes.

Exemplo:

```text
development
testing
staging
production
```

Cada ambiente deve possuir suas próprias configurações.

---

# 7. Segurança

Segurança deve ser considerada como requisito fundamental.

## 7.1 Autenticação

A aplicação deve possuir mecanismo seguro de autenticação.

Exemplos:

- JWT;
- OAuth2;
- OpenID Connect;
- Firebase Authentication;
- SSO.

## 7.2 Autorização

Autenticar um usuário não significa que ele pode executar todas as operações.

A aplicação deve implementar:

- Roles;
- Permissions;
- Resource-based authorization quando necessário.

Exemplo:

```text
ADMIN
MANAGER
USER
READ_ONLY
```

---

# 8. Proteção das APIs

Todas as APIs devem possuir proteção adequada.

Considerar:

- Autenticação;
- Autorização;
- Rate limiting;
- Validação de entrada;
- Sanitização;
- CORS;
- CSRF quando aplicável;
- Proteção contra ataques comuns;
- Limitação de payload;
- Timeout;
- Controle de acesso.

---

# 9. Gestão de usuários

O sistema deve possuir estrutura profissional para gerenciamento de usuários.

Exemplos:

- Cadastro;
- Alteração;
- Ativação/desativação;
- Perfis;
- Permissões;
- Recuperação de acesso;
- Controle de sessões;
- Histórico de acesso;
- Auditoria.

---

# 10. Multi-tenant / White Label

Quando aplicável, a aplicação deve suportar múltiplos clientes.

Exemplo:

```text
Cliente A
    ├── usuários
    ├── configurações
    ├── identidade visual
    └── dados

Cliente B
    ├── usuários
    ├── configurações
    ├── identidade visual
    └── dados
```

Os dados e configurações dos clientes devem permanecer isolados.

O sistema deve permitir:

- Identificação do tenant;
- Configurações por tenant;
- Branding;
- Logo;
- Cores;
- Domínio;
- Configurações funcionais;
- Usuários vinculados;
- Permissões;
- Isolamento de dados.

---

# 11. White Label

Uma aplicação White Label profissional deve permitir personalização sem alteração do código-fonte.

Exemplos:

```text
Nome da aplicação
Logo
Favicon
Cores
Tema
Textos
Domínio
E-mails
Identidade visual
```

Idealmente, um novo cliente deve poder ser criado através de configuração administrativa, e não através de um novo fork do projeto.

---

# 12. Banco de dados

O banco deve possuir:

- Modelo consistente;
- Chaves primárias;
- Foreign Keys quando aplicável;
- Índices;
- Constraints;
- Controle de integridade;
- Estratégia de migrations;
- Histórico de alterações estruturais.

Exemplo:

```text
V1__create_users.sql
V2__create_roles.sql
V3__create_permissions.sql
V4__create_tenants.sql
```

---

# 13. Transações

Operações que alteram múltiplos registros devem possuir controle transacional adequado.

Exemplo:

```text
Criar pedido
    ↓
Criar itens
    ↓
Atualizar estoque
    ↓
Registrar pagamento
```

Se uma etapa crítica falhar, a aplicação deve possuir estratégia para evitar dados inconsistentes.

---

# 14. Tratamento de erros

A aplicação não deve retornar erros técnicos diretamente ao usuário.

Evitar:

```text
NullPointerException
ORA-01403
SQLException
Stack Trace
```

O backend deve possuir um padrão de erro.

Exemplo:

```json
{
  "code": "USER_NOT_FOUND",
  "message": "Usuário não encontrado",
  "timestamp": "2026-09-04T15:00:00Z",
  "traceId": "abc123"
}
```

---

# 15. Logs

A aplicação deve possuir logs estruturados.

Registrar informações relevantes como:

- Data/hora;
- Serviço;
- Usuário;
- Tenant;
- Operação;
- Resultado;
- Tempo de execução;
- Trace ID;
- Erro.

Exemplo:

```text
INFO
2026-09-04T15:00:00
tenant=CLIENT_A
user=123
operation=CREATE_ORDER
status=SUCCESS
duration=245ms
```

---

# 16. Auditoria

Operações críticas devem possuir rastreabilidade.

Exemplo:

```text
Usuário
    ↓
Alterou configuração
    ↓
Data/hora
    ↓
Valor anterior
    ↓
Novo valor
```

Deve ser possível responder:

> Quem fez essa alteração?

> Quando?

> O que foi alterado?

> Qual era o valor anterior?

> Qual é o valor atual?

---

# 17. Observabilidade

Uma aplicação profissional deve permitir identificar problemas rapidamente.

Deve possuir, quando aplicável:

- Logs;
- Metrics;
- Tracing;
- Health checks;
- Monitoramento;
- Alertas.

---

# 18. Health Check

O sistema deve possuir endpoints para verificar sua saúde.

Exemplo:

```text
GET /health
GET /health/live
GET /health/ready
```

Devem permitir identificar problemas como:

```text
Aplicação
Banco de dados
Redis
Filas
APIs externas
Serviços críticos
```

---

# 19. Performance

A aplicação deve possuir preocupação com desempenho.

Considerar:

- Índices de banco;
- Paginação;
- Cache;
- Lazy loading;
- Evitar N+1 queries;
- Compressão;
- Pool de conexões;
- Pool de threads;
- Timeouts;
- Processamento assíncrono quando necessário.

---

# 20. Escalabilidade

A arquitetura deve permitir crescimento.

Deve ser possível aumentar:

```text
Usuários
Requisições
Dados
Integrações
Clientes
```

sem necessidade de reescrever completamente o sistema.

---

# 21. APIs

As APIs devem possuir padrões consistentes.

Considerar:

- Versionamento;
- HTTP status codes;
- DTOs;
- Paginação;
- Filtros;
- Ordenação;
- Validação;
- Documentação;
- Tratamento padronizado de erros.

Exemplo:

```text
/api/v1/users
/api/v1/orders
/api/v1/products
```

---

# 22. Documentação de API

A API deve possuir documentação.

Preferencialmente:

```text
OpenAPI / Swagger
```

A documentação deve apresentar:

- Endpoints;
- Parâmetros;
- Payloads;
- Respostas;
- Erros;
- Autenticação;
- Exemplos.

---

# 23. Frontend

O frontend profissional deve possuir:

- Arquitetura organizada;
- Componentização;
- Gerenciamento de estado;
- Rotas;
- Controle de acesso;
- Tratamento de erros;
- Loading states;
- Empty states;
- Feedback ao usuário;
- Responsividade;
- Acessibilidade;
- Design consistente.

---

# 24. UX

Toda operação deve possuir feedback adequado.

Exemplo:

```text
Carregando...
Salvando...
Sucesso!
Erro!
Nenhum registro encontrado.
```

Evitar interfaces onde o usuário não sabe se uma operação foi executada.

---

# 25. Responsividade

A aplicação deve funcionar adequadamente em:

```text
Desktop
Notebook
Tablet
Mobile
```

quando o produto exigir suporte a esses dispositivos.

---

# 26. Acessibilidade

Quando aplicável, considerar:

- Navegação por teclado;
- Contraste;
- Labels;
- ARIA;
- Foco;
- Leitores de tela;
- Tamanho adequado dos elementos;
- Mensagens acessíveis.

---

# 27. Testes

Uma aplicação profissional deve possuir testes automatizados.

## 27.1 Testes unitários

Validam pequenas unidades de código.

```text
Service
Validator
Util
Domain
```

## 27.2 Testes de integração

Validam integração entre componentes.

```text
API
Database
External Services
Messaging
```

## 27.3 Testes end-to-end

Validam fluxos completos.

Exemplo:

```text
Login
 ↓
Criar pedido
 ↓
Adicionar item
 ↓
Finalizar
 ↓
Consultar pedido
```

---

# 28. CI/CD

O projeto deve possuir pipeline automatizado.

Exemplo:

```text
Commit
 ↓
Build
 ↓
Lint
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Security Scan
 ↓
Package
 ↓
Deploy
```

---

# 29. Controle de versão

Utilizar Git de maneira organizada.

Considerar:

- Branch strategy;
- Pull Requests;
- Code Review;
- Tags;
- Releases;
- Changelog.

---

# 30. Qualidade de código

O pipeline deve identificar problemas automaticamente.

Exemplos:

- Bugs potenciais;
- Vulnerabilidades;
- Código duplicado;
- Complexidade excessiva;
- Dependências vulneráveis;
- Problemas de estilo.

Ferramentas possíveis:

```text
SonarQube
ESLint
Checkstyle
SpotBugs
OWASP Dependency Check
```

---

# 31. Dependências

As dependências devem ser:

- Versionadas;
- Atualizadas;
- Auditadas;
- Minimizadas;
- Monitoradas quanto a vulnerabilidades.

Evitar dependências abandonadas ou desnecessárias.

---

# 32. Integrações externas

Integrações com outros sistemas devem possuir:

- Timeout;
- Retry;
- Circuit breaker quando necessário;
- Logs;
- Tratamento de erros;
- Idempotência;
- Controle de autenticação;
- Monitoramento.

Nunca assumir que uma API externa estará sempre disponível.

---

# 33. Resiliência

O sistema deve saber lidar com falhas.

Exemplos:

```text
API externa indisponível
Banco temporariamente indisponível
Timeout
Resposta inválida
Erro de rede
Fila indisponível
```

A aplicação deve possuir estratégias adequadas para cada situação.

---

# 34. Mensageria

Quando houver processamento assíncrono, considerar:

- Filas;
- Eventos;
- Retry;
- Dead Letter Queue;
- Idempotência;
- Rastreamento de mensagens.

---

# 35. Cache

Quando necessário, utilizar cache de maneira controlada.

Deve existir estratégia para:

- Expiração;
- Invalidação;
- Consistência;
- Limite de memória;
- Fallback.

---

# 36. Backup

Dados críticos devem possuir estratégia de backup.

Definir:

- Frequência;
- Retenção;
- Localização;
- Criptografia;
- Teste de restauração.

Um backup que nunca foi restaurado/testado não deve ser considerado plenamente confiável.

---

# 37. Disaster Recovery

Para sistemas críticos, definir:

```text
RPO
Recovery Point Objective

RTO
Recovery Time Objective
```

Exemplo:

```text
RPO: máximo de 15 minutos de perda de dados
RTO: sistema restaurado em até 1 hora
```

---

# 38. Segurança de dados

Dados sensíveis devem ser protegidos.

Considerar:

- Criptografia em trânsito;
- HTTPS;
- Criptografia em repouso;
- Secrets management;
- Controle de acesso;
- Mascaramento de dados;
- Política de retenção.

---

# 39. LGPD

Para aplicações que tratam dados pessoais no Brasil, considerar requisitos da LGPD.

Exemplos:

- Minimização de dados;
- Finalidade;
- Controle de acesso;
- Retenção;
- Exclusão;
- Auditoria;
- Proteção dos dados;
- Gestão de consentimento quando aplicável.

---

# 40. Gestão de arquivos

Quando a aplicação manipular arquivos, considerar:

- Validação de extensão;
- Validação de MIME type;
- Limite de tamanho;
- Antivírus quando necessário;
- Storage adequado;
- Controle de acesso;
- URLs temporárias;
- Política de retenção.

---

# 41. Segurança de uploads

Nunca confiar apenas na extensão do arquivo.

Exemplo:

```text
arquivo.exe
arquivo.jpg.exe
arquivo.pdf
```

Devem existir validações adicionais.

---

# 42. Internacionalização

Quando necessário, a aplicação deve suportar:

```text
Idioma
Moeda
Timezone
Formato de data
Formato numérico
```

sem alterações estruturais no código.

---

# 43. Timezone

Datas devem possuir estratégia clara de timezone.

Preferencialmente:

```text
Backend / Database
UTC

Frontend
Timezone do usuário
```

---

# 44. Feature Flags

Funcionalidades podem ser ativadas ou desativadas sem novo deploy.

Exemplo:

```text
ENABLE_NEW_REPORT=true
ENABLE_AI=false
ENABLE_NEW_CHECKOUT=true
```

Em aplicações maiores, as flags podem ser configuradas por tenant.

---

# 45. Configuração dinâmica

Configurações importantes não devem exigir alteração de código.

Exemplo:

```text
Parâmetros do sistema
Limites
Integrações
Branding
Feature Flags
Configurações por cliente
```

---

# 46. Multi-ambiente e configuração dinâmica

A aplicação deve permitir:

```text
Desenvolvimento
Homologação
Produção
```

sem recompilar o sistema simplesmente para alterar:

```text
URL do backend
Nome
Logo
Tenant
Configurações
```

---

# 47. Deploy

O processo de deploy deve ser previsível e reproduzível.

Preferencialmente:

```text
Build
 ↓
Artifact
 ↓
Deploy
 ↓
Health Check
 ↓
Smoke Test
```

---

# 48. Rollback

Deve existir estratégia para voltar para uma versão anterior.

Exemplo:

```text
v2.4.1
   ↓
Problema
   ↓
Rollback
   ↓
v2.4.0
```

---

# 49. Versionamento

A aplicação deve possuir versionamento claro.

Exemplo:

```text
1.0.0
1.1.0
1.1.1
2.0.0
```

Também é importante registrar alterações através de um:

```text
CHANGELOG.md
```

---

# 50. Documentação técnica

O projeto deve possuir documentação suficiente para que outro desenvolvedor consiga trabalhar nele.

Exemplo:

```text
README.md
ARCHITECTURE.md
API.md
DATABASE.md
DEPLOY.md
SECURITY.md
CONTRIBUTING.md
CHANGELOG.md
```

---

# 51. Documentação operacional

Também deve existir documentação para operação.

Exemplos:

```text
Como iniciar
Como configurar
Como fazer deploy
Como restaurar backup
Como consultar logs
Como reiniciar serviços
Como executar migrations
Como realizar rollback
```

---

# 52. Desenvolvimento baseado em especificação

Projetos profissionais podem utilizar **Spec-Driven Development**.

Antes de implementar uma funcionalidade relevante:

```text
Requisito
 ↓
Especificação
 ↓
Arquitetura
 ↓
Implementação
 ↓
Testes
 ↓
Code Review
 ↓
Deploy
```

Quando utilizando OpenSpec, as mudanças devem ser refletidas nas especificações antes da implementação.

---

# 53. Modularidade

A aplicação deve permitir evolução por módulos.

Exemplo:

```text
Authentication
Users
Companies
Jobs
Reports
Notifications
Billing
Administration
Audit
```

Um módulo não deve conhecer detalhes internos desnecessários de outro módulo.

---

# 54. Notificações

Quando houver notificações, considerar:

- Persistência;
- Status lida/não lida;
- Data;
- Usuário;
- Tenant;
- Prioridade;
- Expiração;
- Histórico.

---

# 55. Jobs e tarefas agendadas

Processamentos automáticos devem possuir:

- Identificação;
- Logs;
- Controle de execução;
- Retry;
- Tratamento de falhas;
- Histórico;
- Monitoramento.

---

# 56. Concorrência

A aplicação deve considerar operações simultâneas.

Exemplo:

```text
Usuário A ──┐
            ├── Alteração do mesmo registro
Usuário B ──┘
```

Devem ser avaliados:

- Optimistic locking;
- Pessimistic locking;
- Idempotência;
- Controle transacional.

---

# 57. Idempotência

Operações críticas devem evitar duplicidade.

Exemplo:

```text
POST /payments
Idempotency-Key: ABC123
```

Se a mesma requisição for enviada novamente, o sistema não deve criar uma segunda operação indevida.

---

# 58. Métricas

Monitorar métricas relevantes.

Exemplos:

```text
Requests/min
Error rate
Response time
CPU
Memory
Database connections
Queue size
Failed jobs
```

---

# 59. Alertas

Problemas importantes devem gerar alertas.

Exemplos:

```text
API indisponível
Taxa de erro elevada
Banco indisponível
Fila acumulada
Disco cheio
Certificado expirando
```

---

# 60. Segurança de infraestrutura

Considerar:

- Firewall;
- HTTPS;
- Network segmentation;
- Secrets;
- Containers;
- Atualizações;
- Hardening;
- Privilégio mínimo.

---

# 61. Princípio do menor privilégio

Usuários, serviços e aplicações devem possuir somente as permissões necessárias.

Exemplo:

```text
Frontend
    ↓
API
    ↓
Service Account
    ↓
Database
```

O frontend não deve possuir credenciais privilegiadas do banco.

---

# 62. Monitoramento de certificados

Para sistemas que utilizam certificados digitais ou SSL/TLS, deve existir monitoramento de:

```text
Data de expiração
Status
Emissor
Validade
```

Idealmente, gerar alerta antes da expiração.

---

# 63. Compatibilidade

A aplicação deve definir quais versões são suportadas.

Exemplo:

```text
Java 21
Node 22
Oracle 19c
Chrome / Edge / Firefox atuais
```

---

# 64. Governança

Em aplicações corporativas, definir:

- Responsáveis;
- Ambientes;
- Permissões;
- Processo de aprovação;
- Processo de release;
- Processo de incidentes;
- Processo de mudanças.

---

# 65. Gestão de incidentes

Deve existir capacidade de investigar problemas.

Um incidente deve permitir identificar:

```text
Quando aconteceu?
Quem foi afetado?
Qual serviço falhou?
Qual requisição causou o problema?
Qual versão estava em produção?
Qual foi o erro?
Como foi corrigido?
```

---

# 66. Trace ID / Correlation ID

Requisições devem possuir identificadores rastreáveis.

Exemplo:

```text
Frontend
   ↓
traceId=ABC123
   ↓
API
   ↓
Service
   ↓
Database
   ↓
External API
```

Isso permite acompanhar uma operação completa através dos logs.

---

# 67. Segurança no desenvolvimento

O processo de desenvolvimento deve considerar:

```text
SAST
DAST
Dependency Scanning
Secret Scanning
Container Scanning
```

quando aplicável.

---

# 68. Containerização

Quando fizer sentido, utilizar containers para padronizar execução.

Exemplo:

```text
Docker
Docker Compose
Kubernetes
```

Não é obrigatório utilizar Kubernetes em toda aplicação. A tecnologia deve ser proporcional à necessidade do projeto.

---

# 69. Cloud readiness

Uma aplicação profissional deve poder ser executada em infraestrutura moderna quando necessário.

Exemplos:

```text
AWS
Azure
Google Cloud
OCI
Heroku
On-premises
```

A arquitetura não deve depender desnecessariamente de uma infraestrutura específica.

---

# 70. Critério fundamental: simplicidade

Ser profissional não significa ser excessivamente complexo.

Evitar:

```text
Microservices
Kubernetes
Kafka
Redis
Service Mesh
Event Sourcing
```

apenas porque são tecnologias populares.

A arquitetura deve ser proporcional ao problema.

Uma aplicação monolítica bem projetada pode ser muito mais profissional do que uma arquitetura de microserviços mal projetada.

---

# 71. Checklist final

Uma aplicação profissional deve responder positivamente à maior parte das perguntas abaixo:

```text
[ ] A arquitetura é clara?
[ ] As responsabilidades estão separadas?
[ ] Existe autenticação?
[ ] Existe autorização?
[ ] As APIs estão protegidas?
[ ] Existe tratamento de erros?
[ ] Existem logs?
[ ] Existe auditoria?
[ ] Existe monitoramento?
[ ] Existem health checks?
[ ] Existem testes automatizados?
[ ] Existe CI/CD?
[ ] Existe controle de versão?
[ ] Existe documentação?
[ ] Existe estratégia de backup?
[ ] Existe rollback?
[ ] Existe controle de configuração?
[ ] Existem ambientes separados?
[ ] Existe estratégia de segurança?
[ ] Existe controle de dependências?
[ ] Existe estratégia de performance?
[ ] Existe estratégia de escalabilidade?
[ ] Existe tratamento de falhas?
[ ] Existe rastreabilidade?
[ ] Existe controle de acesso?
[ ] Existe estratégia para dados sensíveis?
[ ] A aplicação é preparada para manutenção?
[ ] A aplicação é preparada para evolução?
[ ] A aplicação suporta múltiplos clientes quando necessário?
[ ] Existe isolamento entre tenants?
[ ] Existe suporte a White Label quando necessário?
[ ] Existe documentação operacional?
```

---

# 72. Definição resumida

Uma aplicação de software profissional pode ser definida como:

> **Um sistema projetado não apenas para executar suas funcionalidades, mas para operar de maneira segura, confiável, observável, escalável e sustentável em um ambiente real, permitindo manutenção, evolução, diagnóstico de problemas e crescimento sem comprometer sua estabilidade.**

O principal objetivo não é utilizar a maior quantidade possível de tecnologias.

O objetivo é construir um sistema que seja:

```text
                    PROFISSIONAL
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
    Segurança        Confiabilidade     Qualidade
       │                 │                 │
    Controle          Resiliência        Testes
    Acesso            Backup             Código
    Auditoria         Recovery            UX
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                    Manutenibilidade
                         │
                    Escalabilidade
                         │
                    Observabilidade
                         │
                       Evolução
```

---

# 73. Princípio geral

Antes de considerar uma funcionalidade concluída, a equipe deve avaliar:

1. **Funciona?**
2. **É segura?**
3. **É testável?**
4. **É observável?**
5. **É sustentável?**
6. **É escalável?**
7. **É documentada?**
8. **Pode ser mantida por outra pessoa?**
9. **Pode falhar de maneira controlada?**
10. **Pode evoluir sem quebrar o restante do sistema?**

Se a resposta for positiva, a aplicação está muito mais próxima de um padrão profissional de software.