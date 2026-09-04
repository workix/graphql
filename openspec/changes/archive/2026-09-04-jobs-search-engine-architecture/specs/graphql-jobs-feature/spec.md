## MODIFIED Requirements

### Requirement: Listagem e Busca de Vagas no Frontend Cliente
O Frontend Cliente SHALL disponibilizar página pública de vagas consumindo as queries `searchJobs` e `allJobsPaginated` (além de `allJobsFeatured`), exibindo título, empresa, localização, salário, tipo de contrato, tags/skills, facetas dinâmicas, status de destaque identificado com `is_sponsored` e `sponsor_label` imutável, e paginação funcional, garantindo que vagas patrocinadas ocupem slots demarcados sem suprimir ou rebaixar vagas orgânicas.

#### Scenario: Visualização e Filtro de Vagas no Cliente
- **WHEN** o usuário acessa a página de vagas (`/jobs`)
- **THEN** a lista exibe eventuais vagas patrocinadas claramente rotuladas no topo seguidas pela lista orgânica completa e permite navegar entre páginas, digitar termos com ranking de relevância e aplicar filtros por palavra-chave ou facetas.
