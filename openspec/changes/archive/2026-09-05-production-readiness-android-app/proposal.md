# Proposta: Prontidão de Produção do Aplicativo Android Workix

## Objetivo

Consolidar o aplicativo Android da plataforma Workix para prontidão de produção de nível corporativo, eliminando quaisquer respostas mockadas remanescentes, implementando pipeline real de upload binário e multipart para fotos de perfil e documentos, e garantindo que todas as chamadas de rede e repositórios operem de forma consistente, resiliente e 100% testada contra o backend GraphQL.

## Contexto & Motivação

Durante a auditoria de certificação de software e análise de paridade do ecossistema, identificou-se que o serviço `MediaApiService.kt` no Android continha um fallback que retornava uma URL estática fictícia (`https://storage.googleapis.com/workix-uploads/mock`, `mock-media-123`).
Com a implementação do pipeline de mídia real REST/GraphQL no backend (com validação estrita de Magic Bytes e sanitização anti-XSS), o aplicativo Android deve se comunicar de forma transparente com esses novos endpoints, suportando:
1. Requisitar a URL de upload via mutation GraphQL `requestUploadUrl`.
2. Realizar o upload binário real (PUT/POST com `RequestBody`) para a URL retornada ou upload direto via REST multipart.
3. Confirmar a conclusão do upload via mutation GraphQL `confirmUpload`.
4. Cobertura de testes unitários para validar todo o comportamento de rede sem dependência de serviços externos.

## Escopo

- **Refatoração do `MediaApiService.kt`**:
  - Eliminar fallbacks com URLs fictícias/mockadas.
  - Adicionar funções para upload binário (`uploadFile`) e upload direto (`directUpload`) usando `OkHttpClient`.
  - Tratar adequadamente falhas de rede com `NetworkResult.Error`.
- **Validação e Paridade dos Serviços de Rede Android**:
  - Verificar alinhamento dos DTOs e mutations em todos os serviços de rede (`AuthApiService`, `ResumesApiService`, `ProfilesApiService`, `JobPostingsApiService`, `SelectiveProcessesApiService`, `PostsApiService`, etc.).
- **Testes Unitários e de Integração**:
  - Criar suíte de testes unitários `MediaApiServiceTest.kt` cobrindo sucesso, erro de rede e upload de arquivos binários.
  - Executar `./gradlew testDebugUnitTest` garantindo 100% de sucesso.
