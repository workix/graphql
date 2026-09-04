# Plano de Recuperação de Desastres & Continuidade de Negócios (DRP)
## Workix Platform

Este documento define os procedimentos operacionais padrão (SOP), metas de recuperação e diretrizes para resposta a incidentes críticos, corrupção de dados ou falhas catastróficas de infraestrutura na plataforma Workix.

---

## 1. Objetivos e SLAs de Recuperação

A plataforma Workix estabelece metas rígidas de continuidade alinhadas aos mais altos padrões corporativos e regulatórios:

| Métrica | Meta SLA | Descrição |
| :--- | :--- | :--- |
| **RPO (Recovery Point Objective)** | **≤ 15 minutos** | Perda máxima tolerável de dados em caso de falha severa. Garantido por snapshots periódicos e replicação contínua de logs (WAL/Journaling). |
| **RTO (Recovery Time Objective)** | **≤ 1 hora** | Tempo máximo tolerável para restauração completa dos serviços e disponibilidade das APIs. |
| **Integridade Criptográfica** | **SHA-256 Checksum** | Todo backup gerado possui hash criptográfico para validação imediata antes de qualquer restauração. |
| **Frequência de Dry-Run Drill** | **Semanal automatizado / Mensal manual** | Testes de restauração periódicos em ambiente isolado para verificação da integridade das cópias. |

---

## 2. Estratégia de Backup e Armazenamento

### 2.1 Tipos de Cópias de Segurança
1. **Snapshots Completos Diários**: Realizados durante janelas de menor tráfego (02:00 UTC).
2. **Backups Incrementais / WAL Streaming**: Sincronização a cada 15 minutos para atender ao SLA de RPO.
3. **Imutabilidade e Armazenamento Externo**:
   - Cópias replicadas para armazenamento em nuvem secundário (Multi-Region / Cross-Cloud).
   - Políticas de retenção: 30 dias para snapshots diários, 12 meses para snapshots mensais.

### 2.2 Validação de Integridade
O serviço `BackupManagerService` realiza o cálculo do checksum SHA-256 no momento da geração do snapshot e registra os metadados. Durante a restauração, o checksum é reavaliado:
```typescript
const isIntegrityValid = backupManagerService.verifyIntegrity(filePath, expectedSha256);
```

---

## 3. Procedimento Operacional Padrão (SOP) de Restauração

### Passo 1: Notificação e Declaração de Incidente
1. Identificar o incidente e acionar a equipe de On-Call / SRE.
2. Definir o ponto de restauração desejado (Point-in-Time Recovery - PITR).

### Passo 2: Isolamento do Ambiente
1. Ativar modo de manutenção nas rotas da API (`503 Service Unavailable`).
2. Congelar conexões ativas com o banco de dados principal.

### Passo 3: Validação do Snapshot
1. Executar o teste de restauração em modo de simulação (Dry-Run):
```bash
# Executado via utilitário de DR
npm run test:dr -- --backupId=<backup_id>
```
2. Garantir que o checksum SHA-256 confere com o manifesto de auditoria.

### Passo 4: Restauração no Banco de Dados
- **PostgreSQL**:
  ```bash
  pg_restore -h <db_host> -U <db_user> -d workix_db -v --clean --no-owner <backup_file>.sql
  ```
- **SQLite (Ambiente local/embarcado)**:
  ```bash
  cp <backup_file>.sqlite ./database.sqlite
  ```

### Passo 5: Execução de Health Checks e Sanity Tests
1. Acionar o endpoint `/ready` e verificar se a conectividade com banco e redis está `UP`.
2. Executar suíte de testes de fumaça (Smoke Tests) nas principais queries GraphQL (`tenants`, `users`).

### Passo 6: Liberação do Tráfego
1. Desativar modo de manutenção.
2. Monitorar logs estruturados (`logger.ts`) e métricas de latência nas primeiras 2 horas pós-recuperação.

---

## 4. Matriz de Responsabilidades

| Papel | Responsável | Contato de Emergência |
| :--- | :--- | :--- |
| **Incident Commander** | Tech Lead / Head de Engenharia | oncall-lead@workix.com |
| **Database Administrator (DBA)** | Engenheiro SRE | sre-db@workix.com |
| **Comunicação e Suporte** | Gerente de Suporte ao Cliente | support-escalation@workix.com |

---

## 5. Histórico de Testes de Contingência (Drill Log)

| Data | Tipo de Teste | RTO Atingido | Status | Responsável |
| :--- | :--- | :--- | :--- | :--- |
| 2026-09-04 | Dry-run automatizado de Snapshot | 42 ms | Aprovado | Felipe Rodrigues Michetti |
