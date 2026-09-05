## Context

A plataforma Workix possui uma API GraphQL modularizada em Node.js/TypeScript e dois frontends Vue 3 / Vite (Client em `frontend/client` e Admin em `frontend/admin`). Para que a aplicação esteja 100% pronta para produção, é necessário implementar um endpoint REST de upload de arquivos com validação de segurança ativa, e remover os últimos resquícios de dados mockados em `media.service.ts` e telas do cliente/admin.

## Goals / Non-Goals

**Goals:**
- Implementar endpoint REST Express para upload de mídias (`POST /api/v1/media/upload/:id` e `POST /api/v1/media/direct-upload`) com middleware `multer`, validação de Magic Bytes (`file_security_validator.ts`) e serving estático em `/uploads/media/`.
- Conectar o `media.service.ts` do frontend web cliente para enviar arquivos binários reais e obter URLs públicas definitivas.
- Garantir que todas as telas do Web Cliente e Web Admin consumam dados reais do GraphQL sem mocks ou fallbacks fictícios.

**Non-Goals:**
- Refatoração do aplicativo Android (escopado em proposta subsequente de baby steps).
- Alteração no schema relacional de banco de dados (reutilização das tabelas `media_assets` existentes).

## Decisions

### 1. Upload Híbrido Local e Nuvem
- **Decisão**: Em ambiente local e self-hosted, o backend grava os arquivos validados em `uploads/media/` e serve estaticamente em `http://localhost:4000/uploads/media/:filename`. Em produção com S3/GCS configurado (`STORAGE_DRIVER=s3`), utiliza o fluxo de pre-signed URL existente.
- **Alternativa Considerada**: Exigir bucket AWS S3 obrigatório para rodar em desenvolvimento. Rejeitado por complicar o setup local e testes de desenvolvimento.

### 2. Validação Obrigatória de Segurança no Upload
- **Decisão**: Todo upload binário passa por `file_security_validator.ts` para validação de Magic Bytes, remoção de tags perigosas em SVGs e bloqueio de executáveis disfarçados.
- **Alternativa Considerada**: Confiar apenas no `Content-Type` enviado pelo browser. Rejeitado por graves riscos de segurança (XSS e RCE).

### 3. Integração Transparente nos Frontends Web
- **Decisão**: `media.service.ts` realiza o fluxo de duas etapas: (1) requisita URL via GraphQL `requestUploadUrl` ou upload direto `POST /api/v1/media/upload/:id`, (2) envia `FormData` real e confirma via `confirmUpload`.

## Risks / Trade-offs

- **[Upload de arquivos grandes]** → Limitar tamanho do payload a 10MB para imagens e 25MB para documentos/vídeos com mensagem amigável `413 Payload Too Large`.
- **[Concorrência de nomes de arquivos]** → Gerar hash único com UUID/timestamp no armazenamento (`${uuidv4()}-${sanitizedFileName}`) evitando sobreposição.
