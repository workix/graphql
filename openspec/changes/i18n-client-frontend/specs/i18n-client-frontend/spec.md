## Purpose

Define os requisitos, cenários e formatos de localização internacional (i18n) para a aplicação web do cliente (`frontend/client`), suportando `pt-BR`, `en-US` e `es-ES`.

## ADDED Requirements

### Requirement: Inicialização e Carregamento de Idiomas
O sistema SHALL inicializar a instância de internacionalização com idioma padrão `pt-BR`, suportando fallback para `en-US` e `es-ES`.

#### Scenario: Detecção de idioma salvo
- **WHEN** o usuário acessar a aplicação e possuir uma preferência de idioma em `localStorage`
- **THEN** o sistema SHALL carregar o idioma salvo imediatamente.

#### Scenario: Detecção pelo navegador
- **WHEN** o usuário não possuir preferência salva
- **THEN** o sistema SHALL identificar o locale do navegador ou aplicar `pt-BR` como padrão.

### Requirement: Alternância Reativa de Idioma
O sistema SHALL permitir que o usuário altere o idioma em tempo de execução sem recarregar a página.

#### Scenario: Mudança de idioma via seletor
- **WHEN** o usuário selecionar outro idioma no `LanguageSwitcher`
- **THEN** o sistema SHALL atualizar todas as traduções da interface de forma reativa e salvar a escolha em `localStorage`.

### Requirement: Cobertura Integral de Telas e Módulos
O sistema SHALL cobrir todos os módulos e componentes do cliente (autenticação, perfil, vagas, feed, cursos, conexões, mensagens e notificações).

#### Scenario: Exibição de menus traduzidos
- **WHEN** o idioma for alterado para `en-US`
- **THEN** os menus "Início", "Vagas", "Mensagens" SHALL ser renderizados como "Home", "Jobs", "Messages".
