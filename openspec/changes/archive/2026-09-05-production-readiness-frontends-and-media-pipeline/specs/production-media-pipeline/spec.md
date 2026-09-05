## Purpose

Fornece um pipeline completo e seguro de upload, processamento, validação e disponibilização de arquivos de mídia (fotos de perfil, currículos PDF, logotipos de empresas, anexos e mídias de postagens) com validação de Magic Bytes e compatibilidade tanto em desenvolvimento local quanto em produção.

## ADDED Requirements

### Requirement: Endpoint REST Seguro para Upload de Arquivos
O servidor backend SHALL disponibilizar endpoints REST (`POST /api/v1/media/upload/:id` e `POST /api/v1/media/direct-upload`) capazes de receber arquivos binários via `multipart/form-data`, validando o cabeçalho `Authorization`, o tamanho máximo do arquivo, a extensão e a integridade de Magic Bytes através de `file_security_validator.ts`, persistindo o arquivo com identificador único e atualizando o status do `MediaAsset` para `READY`.

#### Scenario: Upload Direto com Sucesso
- **WHEN** um usuário autenticado envia um arquivo de imagem ou PDF válido através do endpoint de upload
- **THEN** o sistema valida a assinatura de Magic Bytes, armazena o arquivo no diretório seguro de mídia e retorna a URL pública acessível com status `200 OK`.

#### Scenario: Rejeição de Arquivo Malicioso ou Disfarçado
- **WHEN** um usuário tenta enviar um arquivo com extensão `.jpg` cujo conteúdo real contenha código executável ou script malicioso
- **THEN** a validação de Magic Bytes e segurança rejeita a requisição imediatamente com código de erro `400 BAD_REQUEST` e mensagem detalhada sem expor caminhos internos do servidor.

### Requirement: Integração GraphQL de Mídia com Confirmação Automática
A API GraphQL SHALL fornecer as mutations `requestUploadUrl` e `confirmUpload` perfeitamente sincronizadas com o armazenamento local e em nuvem, retornando a URL real de upload e permitindo a resolução de URLs estáticas e persistidas para uso em avatares, logotipos e anexos.

#### Scenario: Ciclo de Vida de Upload via GraphQL
- **WHEN** o cliente solicita uma URL de upload via `requestUploadUrl` e posteriormente confirma via `confirmUpload`
- **THEN** o asset é registrado com status `READY` e a URL pública definitiva é associada à entidade correspondente.
