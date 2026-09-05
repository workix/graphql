# career-transition-and-job-seeking-status Specification

## Purpose

Permite que candidatos sinalizem ativamente no perfil seu status de busca de emprego e de transição de carreira, especificando área de destino e aceitação de vagas de entrada, viabilizando filtros especializados para recrutadores.

## Requirements

### Requirement: Atributos de Status de Carreira no Perfil do Candidato
O sistema SHALL permitir que candidatos configurem em seu perfil: a flag `lookingForJob: Boolean` ("Procurando Emprego"), a flag `inCareerTransition: Boolean` ("Em Transição de Carreira"), o campo textual `careerTransitionTarget: String` ("Área Desejada") e a flag `acceptsEntryLevel: Boolean` ("Aceita Oportunidade de Entrada").

#### Scenario: Ativação do Status de Transição pelo Candidato
- **WHEN** um candidato altera seu perfil ativando `inCareerTransition: true`, informando `careerTransitionTarget: "Desenvolvimento de Software"` e marcando `acceptsEntryLevel: true`
- **THEN** o perfil é atualizado com sucesso e as informações passam a ser exibidas publicamente conforme as configurações de privacidade do candidato.

### Requirement: Badges Visuais e Identificação no Perfil Web e Android
O Frontend Web e o aplicativo Android SHALL renderizar badges destacados no perfil público e nos cards de candidatos quando as flags de busca ativa de emprego ou transição de carreira estiverem ativadas.

#### Scenario: Visualização do Badge de Transição de Carreira
- **WHEN** um recrutador visualiza o perfil de um candidato em transição
- **THEN** a interface exibe o badge "Em Transição para Desenvolvimento de Software" e o indicador "Aberto a vagas de entrada/júnior".

### Requirement: Filtros Especializados de Busca de Candidatos
O motor de busca de candidatos e as interfaces web e Android SHALL disponibilizar filtros específicos para "Procurando Emprego", "Em Transição de Carreira" e pesquisa por área de destino da transição.

#### Scenario: Filtro por Candidatos em Transição de Carreira
- **WHEN** uma empresa pesquisa candidatos marcando o filtro "Em Transição de Carreira" com termo alvo "Dados"
- **THEN** o sistema retorna os candidatos em transição para a área de dados com seus respectivos destaques.
