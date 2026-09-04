## Why

Para cumprir os critérios 36, 37 e 62 do guia de software profissional (Backup, Disaster Recovery e Monitoramento de Certificados SSL/TLS), a plataforma Workix precisa estabelecer rotinas automáticas de backup de dados com teste periódico de integridade e restauração, parâmetros operacionais de Disaster Recovery (RPO e RTO) e monitoramento contínuo da validade de certificados digitais com alertas prévios de expiração.

## What Changes

- **Gerenciamento de Backups e Teste de Restauração (`BackupManagerService`)**: Utilitário para geração de snapshots de dados, compactação, verificação de integridade e teste automatizado de restauração para evitar backups corrompidos.
- **Definição de Disaster Recovery (RPO / RTO)**: Formalização dos parâmetros operacionais de contingência e recuperação de desastres (RPO de 15 minutos e RTO de 1 hora) com procedimento de restore documentado.
- **Monitoramento de Certificados SSL/TLS (`CertificateMonitorService`)**: Serviço de checagem de expiração de certificados para domínios ativos na plataforma com alerta preventivo (30, 15 e 7 dias antes do vencimento).

## Capabilities

### New Capabilities
- `backup-and-disaster-recovery-core`: Rotinas de backup de banco de dados, verificação de integridade e teste automatizado de restauração com métricas de RPO e RTO.
- `ssl-certificate-monitoring-core`: Inspeção e alerta preventivo de validade e expiração de certificados digitais e SSL/TLS.

## Impact

- **Segurança Operacional**: Prevenção de perda de dados e garantia de restabelecimento rápido de serviços em cenários de desastre.
- **Continuidade de Negócio**: Eliminação de riscos de indisponibilidade por certificados SSL expirados em domínios personalizados.
