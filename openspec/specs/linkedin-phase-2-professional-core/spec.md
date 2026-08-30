# Fase 2 — Diferenciação Profissional (Especificação Principal)

### Requirement: Páginas de Empresa e Administração
O sistema SHALL permitir a criação e gestão de Páginas de Empresa (`company_pages`), nomeação de administradores, seguimento de empresas por usuários e listagem de empregados vinculados.

#### Scenario: Criar página de empresa
- **WHEN** o usuário autenticado executar a mutation `createCompanyPage(input: CompanyPageInput!)`
- **THEN** o sistema deve criar a página em `company_pages` e definir o criador como admin em `company_admins`.

### Requirement: Vagas Estruturadas e Algoritmo de Match de Candidatos
O sistema SHALL permitir a publicação de vagas vinculadas a páginas de empresa e calcular o percentual de correspondência (Match Score) entre as competências exigidas na vaga e as competências cadastradas no perfil/currículo do candidato no momento da candidatura.

#### Scenario: Candidatar-se a vaga com cálculo de Match Score
- **WHEN** o candidato aplicar para uma vaga via mutation `applyToJob(jobId: ID!)`
- **THEN** o sistema deve comparar as `required_skills` da vaga com as `skills` do candidato, gerar um `match_score` de 0 a 100% e gravar em `job_applications`.

### Requirement: Endosso de Competências e Recomendações Profissionais
O sistema SHALL permitir que conexões de 1º grau endossem competências no perfil de um usuário e escrevam recomendações formais que podem ser aceitas ou ocultadas pelo destinatário.

#### Scenario: Endossar competência de uma conexão
- **WHEN** o usuário executar a mutation `endorseSkill(skillId: ID!)`
- **THEN** o sistema deve registrar o endosso em `skill_endorsements` e notificar o usuário dono da competência.

#### Scenario: Solicitar ou conceder recomendação profissional
- **WHEN** um usuário criar uma recomendação para outro via mutation `createRecommendation(recipientId: ID!, content: String!)`
- **THEN** o sistema deve criar o registro com status `PENDING` para revisão do destinatário.

### Requirement: Destaques de Perfil e Ranqueamento Algorítmico do Feed
O sistema SHALL permitir que usuários fixem conteúdos (posts, artigos, links externos) na seção de destaques (`featured_items`) do seu perfil profissional, e ordenar o feed social com base no engajamento e proximidade de rede.

#### Scenario: Adicionar item em destaque no perfil
- **WHEN** o usuário executar a mutation `addFeaturedItem(input: FeaturedInput!)`
- **THEN** o sistema deve gravar o item na tabela `featured_items` e exibi-lo no topo do perfil profissional.
