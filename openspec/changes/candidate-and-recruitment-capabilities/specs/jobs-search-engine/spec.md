## ADDED Requirements

### Requirement: Filtros de Busca de Candidatos por Status de Carreira e Currículo
O motor de busca SHALL suportar a pesquisa avançada de candidatos por status "Procurando Emprego" (`lookingForJob: true`), status "Em Transição de Carreira" (`inCareerTransition: true`), área de transição (`careerTransitionTarget`) e termos contidos no currículo normalizado em Markdown, com facetas e contagens agregadas em tempo real.

#### Scenario: Pesquisa de Candidatos com Filtros Combinados
- **WHEN** um recrutador pesquisa candidatos combinando a flag `lookingForJob: true`, tecnologia "React" e termo de currículo "TypeScript"
- **THEN** o motor de busca retorna exclusivamente os perfis elegíveis autorizados por `reveal()`, aplicando ordenação por relevância e atualizando os contadores de facetas.
