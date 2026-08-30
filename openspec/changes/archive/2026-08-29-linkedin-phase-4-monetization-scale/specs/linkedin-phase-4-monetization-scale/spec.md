## ADDED Requirements

### Requirement: Hashtags e Menções em Posts
O sistema SHALL extrair automaticamente hashtags e menções do conteúdo de um post no momento da criação, permitindo descoberta por hashtag e notificação do usuário mencionado.

#### Scenario: Criar post com hashtag e menção
- **WHEN** o usuário executar a mutation `createPost(authorId: ID!, content: String!)` com conteúdo contendo `#tag` e `@usuario`
- **THEN** o sistema deve registrar a hashtag em `hashtags`/`post_hashtags` e a menção em `mentions`, notificando o usuário mencionado.

#### Scenario: Buscar posts por hashtag
- **WHEN** o usuário executar a query `postsByHashtag(tag: String!)`
- **THEN** o sistema deve retornar os posts associados àquela hashtag.

### Requirement: Planos Premium e InMail
O sistema SHALL permitir a assinatura de planos premium e o envio de mensagens diretas (InMail) a usuários fora do grafo de conexões, consumindo créditos mensais do plano ativo.

#### Scenario: Enviar InMail a não-conexão com plano ativo
- **WHEN** um usuário com `UserSubscription` ativa e créditos de InMail disponíveis executar `sendMessage` para um destinatário que não é conexão
- **THEN** o sistema deve enviar a mensagem e decrementar o contador de créditos de InMail do remetente.

#### Scenario: Bloquear InMail sem plano ativo
- **WHEN** um usuário sem plano premium ativo tentar enviar mensagem para um destinatário que não é conexão
- **THEN** o sistema deve rejeitar a operação.

### Requirement: LinkedIn Learning
O sistema SHALL permitir a criação de cursos com aulas em vídeo, matrícula de usuários e emissão de certificado de conclusão exibido no perfil.

#### Scenario: Concluir curso e emitir certificado
- **WHEN** um usuário matriculado concluir todas as aulas de um curso
- **THEN** o sistema deve registrar `CourseCompletion` com URL de certificado, exibido na seção de Licenças e Certificações do perfil.

### Requirement: Social Selling Index
O sistema SHALL calcular periodicamente um índice de 0 a 100 (Social Selling Index) por usuário, combinando atividade de posts, engajamento, qualidade da rede de conexões e taxa de resposta a mensagens/InMails.

#### Scenario: Consultar SSI do próprio perfil
- **WHEN** o usuário executar a query `mySocialSellingIndex`
- **THEN** o sistema deve retornar o score mais recente calculado para aquele usuário.

### Requirement: Verificação de Identidade
O sistema SHALL permitir que um usuário solicite verificação de identidade por e-mail corporativo, telefone ou documento oficial, exibindo um selo verificado no perfil quando aprovado.

#### Scenario: Verificar identidade via e-mail corporativo
- **WHEN** o usuário executar a mutation `verifyIdentity(userId: ID!, method: "WORK_EMAIL")` e confirmar a posse do e-mail via token JWT de confirmação
- **THEN** o sistema deve marcar `users.verified = true` e `users.verification_method = 'WORK_EMAIL'`.
