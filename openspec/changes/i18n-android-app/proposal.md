## Why

O aplicativo nativo Android (`android/`) atualmente possui strings estáticas concentradas apenas em português (`res/values/strings.xml`). Para atender a base de usuários multilíngue (Português do Brasil, Inglês dos EUA e Espanhol), é indispensável criar a estrutura nativa de recursos do Android (`values-pt-rBR`, `values-en-rUS` ou `values-en`, `values-es`), padronizando todas as chaves e permitindo que o sistema operacional e a preferência do usuário ajustem automaticamente o idioma da aplicação.

## What Changes

- Extração e padronização de todas as strings do app Android.
- Criação dos arquivos de recursos localizados:
  - `android/app/src/main/res/values-pt-rBR/strings.xml` (Português - Brasil)
  - `android/app/src/main/res/values-en-rUS/strings.xml` (ou `values-en/strings.xml` - Inglês EUA)
  - `android/app/src/main/res/values-es/strings.xml` (Espanhol)
  - `android/app/src/main/res/values/strings.xml` (Base / Default com fallback)
- Utilitário em Kotlin para gerenciamento de Locale em tempo de execução (`LocaleHelper.kt`) caso o usuário deseje alternar o idioma diretamente nas configurações do aplicativo.

## Capabilities

### New Capabilities
- `i18n-android-app`: Suporte à localização nativa Android em 3 idiomas (pt-BR, en-US, es-ES) com compatibilidade de sistema e seleção in-app.

### Modified Capabilities

## Impact

- **Código Afetado**: `android/app/src/main/res/values*/strings.xml`, `android/app/src/main/java/`.
- **Compatibilidade**: Conformidade com as diretrizes do Android SDK de internacionalização e recursos de string.
