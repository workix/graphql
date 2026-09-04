## Purpose

Monitora preventivamente a data de expiração de certificados digitais e conexões SSL/TLS da aplicação e dos domínios customizados White Label, emitindo alertas graduais antes da expiração.

## ADDED Requirements

### Requirement: Inspeção Preventiva de Validade de Certificados SSL/TLS
O sistema SHALL verificar a data de validade dos certificados SSL/TLS configurados para a plataforma e para os domínios customizados cadastrados no módulo White Label, calculando os dias restantes até a expiração.

#### Scenario: Verificação de Certificado Válido
- **WHEN** o monitor de certificados inspeciona um domínio com certificado ativo por mais de 30 dias
- **THEN** o sistema reporta o status como válido (`VALID`) e indica a data limite de expiração

#### Scenario: Alerta de Certificado Próximo da Expiração
- **WHEN** o certificado de um domínio estiver a menos de 30 dias de expirar
- **THEN** o sistema emite alerta preventivo de nível de atenção (`WARNING` ou `CRITICAL`) com a antecedência necessária para renovação
