## Purpose

Especifica o fechamento de paridade para os módulos de vagas avançadas com match score, depoimentos, newsletter e estatísticas em todas as plataformas clientes.

## ADDED Requirements

### Requirement: Consulta de Vagas Avançadas e Match Score
O sistema SHALL permitir consulta de vagas profissionais com cálculo de afinidade e match score via query `jobPostings` e mutation `applyToJob`.

#### Scenario: Consulta de vagas com match score
- **WHEN** o candidato busca vagas recomendadas
- **THEN** o percentual de compatibilidade de perfil é calculado e exibido.

### Requirement: Consumo de Depoimentos e Newsletter no Android
O sistema SHALL disponibilizar no aplicativo Android o consumo de depoimentos (`allTestimonials`), newsletter (`subscribeMail`) e estatísticas (`statisticsCount`).

#### Scenario: Inscrição na newsletter via Android
- **WHEN** o usuário informa seu e-mail no aplicativo mobile
- **THEN** a inscrição é registrada com sucesso via `SubscribersApiService.kt`.
