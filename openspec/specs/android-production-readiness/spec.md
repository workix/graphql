# Specification: Android Production Readiness

## Purpose

Garante que o aplicativo Android opere sem dados mockados ou estáticos, integrando o pipeline real de upload de arquivos binários e multimídia, e mantendo cobertura de testes automatizados completa.

## Requirements

### Requirement: Upload Real de Mídias no Android sem Mocks
O módulo `MediaApiService` do Android SHALL realizar requisições à API GraphQL real e endpoints REST ativos sem nenhum fallback para URLs fictícias ou IDs pré-fabricados.

#### Scenario: Obtenção de URL de Upload Real
- **WHEN** o aplicativo requisita uma URL de upload para uma foto de perfil através de `requestUploadUrl`
- **THEN** a resposta da API GraphQL é desserializada e retornada em `NetworkResult.Success`, ou em caso de erro da API, retorna `NetworkResult.Error` detalhado.

#### Scenario: Transmissão Binária de Arquivo
- **WHEN** o aplicativo envia os bytes reais de uma imagem ou documento PDF para o endpoint de upload retornado
- **THEN** o arquivo é transmitido via HTTP PUT/POST e o status `200 OK` é retornado com sucesso.

### Requirement: Cobertura de Testes Unitários de Rede
O conjunto de testes unitários do Android SHALL validar todos os cenários de sucesso, erro e upload do serviço de mídia e demais clientes de rede.

#### Scenario: Execução dos Testes Unitários
- **WHEN** a suíte de testes unitários do Android for executada via `./gradlew testDebugUnitTest`
- **THEN** 100% dos testes devem passar com sucesso sem falhas.
