# Workix - Manual Operacional e de Infraestrutura

Este documento reúne os procedimentos operacionais para execução, monitoramento, deploy, diagnóstico e contingência da plataforma Workix.

---

## 1. Inicialização e Execução

### Variáveis de Ambiente Essenciais
```env
PORT=4000
NODE_ENV=production
DB_DIALECT=postgres # ou sqlite para desenvolvimento
DB_HOST=localhost
DB_PORT=5432
DB_NAME=workix
DB_USER=workix_user
DB_PASS=secret
JWT_SECRET=super-secret-jwt-key
RABBITMQ_SERVER_HOST=amqp://localhost:5672
ELASTICSEARCH_NODE=http://localhost:9200
LOG_LEVEL=info
```

### Comandos de Inicialização
```bash
# Instalação de dependências
npm install

# Executar em ambiente de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Iniciar servidor em produção
npm start
```

---

## 2. Banco de Dados e Migrações

### Execução de Migrações
```bash
npx sequelize-cli db:migrate
```

### Execução de Seeders
```bash
npx sequelize-cli db:seed:all
```

### Rollback de Migrações
```bash
npx sequelize-cli db:migrate:undo
```

---

## 3. Observabilidade e Health Checks

Os endpoints abaixo são utilizados para monitoramento por orquestradores (Kubernetes, AWS ECS, GCP Cloud Run) e ferramentas como Prometheus/Datadog:

| Endpoint | Finalidade | Código HTTP Esperado |
|---|---|---|
| `GET /health` | Status geral e uptime | `200 OK` |
| `GET /health/live` | Liveness probe do contêiner | `200 OK` |
| `GET /health/ready` | Readiness probe (testa banco de dados e dependências) | `200 OK` (ou `503 Service Unavailable` se DB inativo) |
| `GET /health/metrics` | Métricas de CPU, Heap e Event Loop | `200 OK` |

---

## 4. Diagnóstico de Incidentes e Rastreabilidade

Todas as requisições possuem um identificador único de rastreamento (`traceId`), retornado no cabeçalho HTTP `x-trace-id` e presente em todos os logs estruturados JSON emitidos pela aplicação:

```bash
# Filtrar logs de uma requisição específica
grep "trace-abc-123" /var/log/workix/app.log | jq .
```

---

## 5. Estratégia de Deploy e Rollback

1. **Deploy Seguro (Blue/Green ou Rolling Update)**:
   - Iniciar nova instância com a nova versão.
   - Orquestrador aguarda a sonda `GET /health/ready` retornar status `200 OK`.
   - Direcionamento gradual de tráfego para a nova versão.
2. **Rollback Imediato**:
   - Em caso de degradação, reverter o apontamento de tráfego para a versão anterior.
   - Executar `npx sequelize-cli db:migrate:undo` caso uma migração seja incompatível com a versão anterior.
