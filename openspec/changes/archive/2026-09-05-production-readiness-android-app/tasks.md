## 1. Eliminação de Mocks e Upload Real de Mídia no Android

- [x] 1.1 Refatorar `MediaApiService.kt` removendo fallbacks mockados e adicionando métodos de upload binário (`uploadFile`) e direto (`directUpload`) via OkHttpClient
- [x] 1.2 Ajustar resolução de URLs de host local para emuladores e dispositivos físicos (`http://10.0.2.2:4000` / URL customizada)
- [x] 1.3 Criar testes unitários para `MediaApiService.kt` cobrindo cenários de sucesso, erro e upload de dados em `android/app/src/test/java/br/com/codecode/workix/android/network/MediaApiServiceTest.kt`

## 2. Validação e Execução da Suíte Completa do Android

- [x] 2.1 Executar a suíte de testes unitários do Android (`./gradlew testDebugUnitTest`)
- [x] 2.2 Validar build e geração de artefatos do aplicativo Android

