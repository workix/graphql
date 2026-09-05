# Design Técnico: Prontidão de Produção do Aplicativo Android Workix

## Arquitetura de Comunicação e Upload de Mídia

O Android utiliza uma arquitetura baseada em Coroutines, OkHttp e GraphQL manual/Apollo para consumo do ecossistema Workix.

### 1. Fluxo de Upload em 2 Etapas (Presigned / Local Backend REST)

```mermaid
sequenceDiagram
    participant App as Android Client (MediaApiService)
    participant BackendGraphQL as GraphQL API (:4000/graphql)
    participant BackendREST as Media REST Router (:4000/api/v1/media)

    App->>BackendGraphQL: mutation requestUploadUrl(input: { fileName, fileType, context })
    BackendGraphQL-->>App: { uploadUrl: "/api/v1/media/upload/id123", mediaId: "id123" }
    App->>BackendREST: PUT /api/v1/media/upload/id123 (Binary Bytes)
    BackendREST-->>App: 200 OK { success: true, url: "/uploads/media/...", asset: {...} }
    App->>BackendGraphQL: mutation confirmUpload(mediaId: "id123")
    BackendGraphQL-->>App: confirmUpload: true
```

### 2. Fluxo de Upload Direto (Single-Step Multipart/Binary)

```mermaid
sequenceDiagram
    participant App as Android Client (MediaApiService)
    participant BackendREST as Media REST Router (:4000/api/v1/media)

    App->>BackendREST: POST /api/v1/media/direct-upload?context=profile&fileName=avatar.png
    Note over BackendREST: Validação de Magic Bytes & Sanitização
    BackendREST-->>App: 200 OK { success: true, url: "/uploads/media/...", asset: {...} }
```

## Tratamento de Erros e Resiliência

- `NetworkResult<T>` é utilizado universalmente para envelopar respostas em `NetworkResult.Success(data)` ou `NetworkResult.Error(message)`.
- Se o servidor retornar erros GraphQL ou HTTP 4xx/5xx, o erro é propagado de forma amigável ao usuário sem quebrar a UI ou recorrer a dados fictícios.
