# Especificação: Internacionalização do Painel Administrativo (i18n)

## Purpose

Define os requisitos de localização para o painel administrativo (`frontend/admin`), integrando `vue-i18n` com Vuetify 3 para `pt-BR`, `en-US` e `es-ES`.

## Requirements

### Requirement: Integração com Vuetify 3 Adapter
O sistema SHALL integrar o `vue-i18n` com o adaptador de componentes do Vuetify 3 (`createVueI18nAdapter`) permitindo tradução unificada de labels customizados e textos internos do framework.

#### Scenario: Tradução de componentes nativos
- **WHEN** o usuário alternar para `en-US`
- **THEN** tanto os textos da aplicação quanto os controles nativos do Vuetify (paginador de tabelas, botões de fechar diálogos) SHALL refletir o idioma selecionado.

### Requirement: Alternância e Persistência Administrativa
O sistema SHALL fornecer controle de idioma na barra superior da aplicação (AppBar) com persistência em `localStorage`.

#### Scenario: Seleção de idioma pelo administrador
- **WHEN** o administrador selecionar `es-ES` no menu de idiomas
- **THEN** toda a interface do dashboard, tabelas e relatórios SHALL ser atualizada instantaneamente.

### Requirement: Dicionários Administrativos Completos
O sistema SHALL disponibilizar dicionários cobrindo Dashboard, Usuários, Permissões, Vagas, Processos Seletivos e Auditoria.

#### Scenario: Visualização de métricas e status
- **WHEN** visualizado em `en-US`
- **THEN** os status "Ativo", "Pendente", "Rejeitado" SHALL ser exibidos como "Active", "Pending", "Rejected".
