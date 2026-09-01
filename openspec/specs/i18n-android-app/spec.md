# Especificação: Internacionalização do Aplicativo Nativo Android (i18n)

## Purpose

Define os requisitos de localização para o aplicativo nativo Android (`android/`), garantindo que todas as telas, botões, mensagens de erro e diálogos estejam disponíveis em `pt-BR`, `en-US` e `es-ES`.

## Requirements

### Requirement: Recursos Nativos Android Localizados
O sistema SHALL disponibilizar arquivos `strings.xml` para cada locale suportado (`values/`, `values-pt-rBR/`, `values-en-rUS/`, `values-es/`).

#### Scenario: Execução em dispositivo em inglês
- **WHEN** o aplicativo for executado em um dispositivo configurado com idioma inglês (`en-US`)
- **THEN** o Android SHALL carregar automaticamente as strings de `values-en-rUS/strings.xml` (ou `values-en/strings.xml`).

#### Scenario: Execução em dispositivo em espanhol
- **WHEN** o aplicativo for executado em um dispositivo configurado com idioma espanhol (`es-ES`)
- **THEN** o Android SHALL carregar automaticamente as strings de `values-es/strings.xml`.

### Requirement: Suporte a Alternância In-App
O sistema SHALL disponibilizar utilitário `LocaleHelper` para permitir a seleção explícita de idioma pelo usuário dentro das preferências do app, sobrescrevendo a preferência do sistema quando solicitado.

#### Scenario: Mudança de idioma in-app
- **WHEN** o usuário selecionar Espanhol nas configurações do app
- **THEN** o `LocaleHelper` SHALL atualizar a `Configuration` do contexto e aplicar o locale `es`.
