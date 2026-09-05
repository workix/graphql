## Purpose

Disponibiliza aos candidatos com plano Premium um ecossistema analítico avançado de visibilidade e alcance do currículo, permitindo rastrear quem visualizou o perfil, registrar aparições nos motores de busca da plataforma, analisar termos de pesquisa mais frequentes e acompanhar métricas de exposição com respeito à privacidade.

## ADDED Requirements

### Requirement: Rastreabilidade e Identificação de Visualizadores de Currículo
O sistema SHALL registrar e fornecer aos candidatos Premium a identificação dos usuários e organizações que visitaram seu perfil, distinguindo visualizações efetuadas por empresas/recrutadores (`RECRUITER_COMPANY`) daquelas realizadas por outros candidatos/usuários (`CANDIDATE_USER`), exibindo dados institucionais (nome da empresa, logotipo e cargo) quando o visualizador consentir com a visibilidade.

#### Scenario: Candidato Premium visualiza lista detalhada de visitantes
- **WHEN** um candidato com assinatura Premium ativa consulta a lista de quem visualizou seu currículo
- **THEN** o sistema retorna a lista completa de visualizações com data/hora, tipo de visitante, nome e logotipo da empresa (para recrutadores) ou identificação do usuário, exceto quando o visualizador tiver configurado privacidade anônima (`show_as_viewed = false`).

#### Scenario: Visualizador configurou modo anônimo de navegação
- **WHEN** um usuário ou recrutador com `show_as_viewed = false` visualiza o perfil de um candidato
- **THEN** o sistema registra o evento para fins quantitativos, mas mascara a identidade como "Recrutador Anônimo" ou "Membro do Workix" sem expor dados nominais ou organizacionais.

#### Scenario: Candidato do plano gratuito acessa histórico de visualizadores
- **WHEN** um candidato sem plano Premium ativo consulta quem visualizou seu perfil
- **THEN** o sistema retorna apenas a contagem agregada de visitas e uma amostra mascarada/bloqueada, acompanhada de convite/CTA para upgrade de plano.

### Requirement: Registro e Contabilização de Aparições nos Motores de Busca
O sistema SHALL registrar automaticamente impressões de busca sempre que um candidato for retornado como resultado na pesquisa de candidatos (`searchCandidates`), registrando os termos de pesquisa, filtros aplicados, data e o contexto da busca para compor o histórico de alcance do currículo.

#### Scenario: Candidato aparece como resultado de busca ativa de recrutador
- **WHEN** um recrutador realiza uma busca por termos (ex.: "React", "TypeScript", "São Paulo") e o perfil do candidato é retornado na página de resultados
- **THEN** o sistema grava uma impressão de busca (`search_appearance`) vinculada ao candidato com os termos pesquisados e a data do evento.

#### Scenario: Candidato com visibilidade desativada não gera aparições
- **WHEN** um candidato possui a configuração `searchable_by_recruiters = false`
- **THEN** o candidato é excluído dos resultados de busca e nenhuma aparição é contabilizada.

### Requirement: Agregação de Métricas Temporais e Série Histórica de Alcance
O sistema SHALL disponibilizar métricas agregadas e série temporal diária/semanal para períodos configuráveis (7 dias, 30 dias, 90 dias e 12 meses), computando o total de visualizações de perfil, o total de aparições em buscas, a taxa de conversão (aparições para visualizações) e o ranking dos principais termos de busca.

#### Scenario: Consulta de métricas em período selecionado
- **WHEN** o candidato Premium seleciona o período de análise de 30 dias no painel analítico
- **THEN** o sistema calcula e retorna os totais agregados do período, a variação percentual em relação ao período anterior, os pontos da série temporal diária e as palavras-chave mais populares.

### Requirement: Painel Analítico Exclusivo para Candidatos Premium
O sistema SHALL disponibilizar uma interface de painel analítico exclusiva e interativa no frontend (`/analytics/views` / `/analytics/resume-reach`), exibindo cards de indicadores, gráficos de evolução de alcance, distribuição por tipo de visitante, ranking de empresas com maior interesse no perfil e recomendações de palavras-chave para otimização de SEO de currículo.

#### Scenario: Acesso ao painel analítico por candidato Premium
- **WHEN** o candidato autenticado com plano Premium acessa o painel de alcance do currículo
- **THEN** a interface renderiza todos os gráficos interativos, lista de visualizadores identificados com links para empresas e painel de termos de busca em destaque.

#### Scenario: Acesso ao painel por usuário do plano Free
- **WHEN** o candidato autenticado no plano Free acessa o painel de alcance
- **THEN** a interface exibe as métricas consolidadas básicas e apresenta sobreposição/card de bloqueio com botão de upgrade para desbloquear a visualização detalhada de quem visualizou e o gráfico histórico completo de buscas.
