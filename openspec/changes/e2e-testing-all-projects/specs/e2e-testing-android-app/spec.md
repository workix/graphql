## Purpose

Especifica a suíte de testes de instrumentação e ponta a ponta (E2E) com 100% de cobertura de telas e fluxos críticos para o aplicativo Android nativo, garantindo a integridade dos fluxos do usuário móvel com Espresso e AndroidX Test.

## ADDED Requirements

### Requirement: Fluxo E2E de Lançamento e Autenticação no Aplicativo Android
O aplicativo Android DEVE inicializar corretamente a tela inicial/login, validar campos obrigatórios e autenticar o usuário contra o backend.

#### Scenario: Inicialização e Acesso com Credenciais Válidas
- **WHEN** o usuário abre o aplicativo e realiza o login com e-mail e senha válidos
- **THEN** o aplicativo SHALL autenticar o usuário, persistir a sessão e transitar para a tela principal (MainActivity)

#### Scenario: Validação de Erro em Login Inválido
- **WHEN** o usuário submete credenciais inválidas na tela de login
- **THEN** o aplicativo SHALL exibir mensagem de erro amigável ao usuário sem sofrer crash

### Requirement: Navegação, Busca de Vagas e Detalhes no App Android
O aplicativo Android DEVE carregar a listagem de vagas via GraphQL/API, permitir busca por filtros e exibir os detalhes completos da vaga selecionada.

#### Scenario: Busca de Vaga e Exibição de Detalhes
- **WHEN** o usuário seleciona uma categoria ou digita um filtro na barra de pesquisa
- **THEN** o RecyclerView de vagas SHALL atualizar com os resultados e ao tocar em um item navegar para a tela de detalhes com informações completas

### Requirement: Submissão de Candidatura e Gestão de Perfil no App Android
O aplicativo Android DEVE permitir o envio de candidatura para uma vaga selecionada a partir da tela de detalhes da vaga e visualização/atualização de dados do perfil.

#### Scenario: Envio de Candidatura com Sucesso no App
- **WHEN** o candidato logado clica no botão de candidatura na tela de detalhes
- **THEN** o app SHALL enviar a mutação GraphQL e exibir confirmação visual de inscrição concluída
