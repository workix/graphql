# graphql-client-infrastructure Specification

## Purpose
Estabelece os requisitos de infraestrutura de rede e comunicação GraphQL para os frontends Web (Client e Admin) e Mobile (Android), incluindo configuração de ambiente, clientes HTTP/GraphQL e desacoplamento de autenticação.

## Requirements

### Requirement: Cliente GraphQL Configurável por Ambiente
Os três projetos frontend (Client, Admin, Android) SHALL implementar clientes GraphQL configurados para consumir o endpoint a partir de variáveis de ambiente configuráveis (por padrão `http://localhost:4000/graphql` para web e `http://10.0.2.2:4000/graphql` para emuladores Android).

#### Scenario: Leitura do Endpoint GraphQL das Variáveis de Ambiente
- **WHEN** a aplicação web ou o app Android inicia
- **THEN** o cliente GraphQL inicializa a URL base a partir da configuração de ambiente sem hardcoding no código fonte das telas.

### Requirement: Desacoplamento da Autenticação Obrigatória sem Perda da Camada de Autorização
Os clientes GraphQL e roteadores de navegação SHALL permitir a navegação e execução de queries/mutations sem bloqueio por falta de token Firebase, mas SHALL manter a arquitetura de interceptors preparada para injetar o header `Authorization: Bearer <token>` quando configurada.

#### Scenario: Execução de Operação sem Token de Autenticação
- **WHEN** o usuário navega pelas telas do sistema ou submete requisições GraphQL
- **THEN** o sistema permite a execução sem erro de bloqueio de autenticação local nos guards de rotas.

### Requirement: Execução de Query Real de Validação de Conectividade
Os três projetos SHALL possuir testes ou rotas de verificação capazes de executar uma query real (como `statisticsCount` ou `allJobs`) contra o backend local em `http://localhost:4000/graphql` e validar o retorno com sucesso.

#### Scenario: Validação de Conexão Bem-Sucedida
- **WHEN** o teste de infraestrutura ou a query de inicialização é disparada
- **THEN** a resposta contém dados válidos retornados pelo servidor GraphQL local sem erros de CORS, conexão ou parser.
