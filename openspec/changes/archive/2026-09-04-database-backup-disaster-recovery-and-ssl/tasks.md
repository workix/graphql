## 1. Gerenciamento de Backup & Disaster Recovery

- [x] 1.1 Implementar `src/utils/backup_manager.service.ts` com criação de snapshot, checksum SHA-256 e teste de restauração
- [x] 1.2 Criar documento de procedimentos de contingência `DISASTER_RECOVERY.md` com definição de RPO (15m) e RTO (1h)
- [x] 1.3 Criar testes unitários para `BackupManagerService` em `tests/unit/backup_manager.spec.ts`

## 2. Monitoramento de Certificados SSL/TLS

- [x] 2.1 Implementar `src/utils/certificate_monitor.service.ts` com cálculo de expiração e alertas para domínios White Label
- [x] 2.2 Criar testes unitários para `CertificateMonitorService` em `tests/unit/certificate_monitor.spec.ts`

## 3. Validação & Bateria de Testes

- [x] 3.1 Executar suíte completa de testes (`npm test`) garantindo 100% de sucesso
