# support-forms-members-core Specification

## Purpose
Especifica o comportamento, regras de envio e exibição de formulários de contato/suporte e apresentação dos membros da equipe institucional no ecossistema Workix.

## Requirements

### Requirement: Envio de Formulário de Contato e Suporte
O sistema SHALL permitir que visitantes e usuários enviem mensagens de suporte e contato via mutation `createForm(input: FormInput!)` contendo nome, e-mail, assunto e mensagem.

#### Scenario: Envio de mensagem com sucesso
- **WHEN** o usuário preenche o formulário em `/contact` e clica em enviar
- **THEN** a mensagem é registrada e uma confirmação visual é exibida.

### Requirement: Apresentação da Equipe Institucional
O sistema SHALL listar os membros do time institucional via query `allMembers(start, max)` exibindo nome, cargo, foto, biografia e links de redes sociais.

#### Scenario: Visualização da equipe Workix
- **WHEN** o usuário acessa a página `/team`
- **THEN** os cards dos membros da equipe com suas informações institucionais são renderizados.

### Requirement: Interface Mobile de Suporte e Equipe no Android
O sistema SHALL disponibilizar tela de suporte e fragment de equipe no app Android através do `ContactActivity.kt` e `TeamFragment.kt`.

#### Scenario: Envio de suporte no Android
- **WHEN** o usuário acessa o formulário de suporte no app Android
- **THEN** ele pode submeter uma mensagem diretamente à equipe de suporte.
