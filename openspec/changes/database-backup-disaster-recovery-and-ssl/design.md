## Context

Atendendo aos critérios 36, 37 e 62 do guia de software profissional, este módulo fornece rotinas operacionais para backup e restore com verificação de integridade, definição de SLA de Disaster Recovery (RPO 15min / RTO 1h) e monitoramento de certificados SSL/TLS para a plataforma e domínios White Label.

## Goals / Non-Goals

**Goals:**
- Implementar `BackupManagerService` com suporte a cópia de segurança de banco relacional, cálculo de checksum SHA-256 e teste automatizado de restauração (*dry-run restore test*).
- Implementar `CertificateMonitorService` com cálculo de dias restantes para expiração de certificados e categorização (`VALID`, `EXPIRING_SOON`, `EXPIRED`).
- Criar documentação operacional de Disaster Recovery em `DISASTER_RECOVERY.md`.
- Testes unitários cobrindo geração de backup, integridade de restauração e cálculo de alertas de certificados SSL.

**Non-Goals:**
- Configuração de cron jobs no nível do SO nesta fase (o serviço expõe os métodos Node/TypeScript prontos para execução via CLI, cron ou endpoints administrativos).
