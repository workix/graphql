# file-upload-security-core Specification

## Purpose
Garante que todos os uploads de arquivos na plataforma passem por validação binária de assinatura (magic bytes), verificação de tamanho máximo e sanitização de nome contra ataques de injeção e path traversal.

## Requirements

### Requirement: Validação de Assinatura Binária (Magic Bytes)
O sistema SHALL inspecionar os primeiros bytes do buffer de arquivos enviados (PDF, JPEG, PNG, WEBP) para comprovar sua autenticidade, rejeitando arquivos que possuam extensão forjada ou executáveis disfarçados.

#### Scenario: Upload de PDF Válido
- **WHEN** um usuário faz upload de um currículo em formato PDF com cabeçalho binário `%PDF-`
- **THEN** o sistema aprova o arquivo e permite seu armazenamento seguro

#### Scenario: Bloqueio de Executável Disfarçado
- **WHEN** um arquivo malicioso com extensão `.pdf` contendo cabeçalho executável (`MZ` / `PE`) é enviado
- **THEN** o sistema rejeita a operação com erro de validação de tipo de mídia não permitido

### Requirement: Sanitização de Nome e Limite de Tamanho de Arquivo
O sistema SHALL sanitizar o nome de arquivo removendo sequências de diretório (`../`, `..\`) e caracteres perigosos, além de aplicar o limite estrito de tamanho por tipo de recurso.

#### Scenario: Sanitização de Nome de Arquivo com Path Traversal
- **WHEN** o cliente envia um arquivo com o nome `../../etc/passwd.jpg`
- **THEN** o sistema sanitiza o nome para um identificador seguro mantendo apenas caracteres alfanuméricos e extensão permitida
