## Purpose

Permite que candidatos criem, editem, visualizem e normalizem seus currículos profissionais utilizando Markdown estruturado, com preview interativo no frontend web, renderização consistente no aplicativo Android e indexação profunda para o motor de busca.

## ADDED Requirements

### Requirement: Modelo e Persistência do Currículo Normalizado em Markdown
O sistema SHALL armazenar e gerenciar currículos normalizados em formato Markdown associados a candidatos, estruturando os campos de resumo profissional, histórico de experiências, empresas, cargos, tecnologias, competências, formação acadêmica, certificações, idiomas, projetos e objetivos de carreira.

#### Scenario: Salvamento de Currículo com Sucesso
- **WHEN** um candidato envia ou atualiza o conteúdo do seu currículo formatado em Markdown através da mutation `saveNormalizedResume`
- **THEN** o sistema valida e sanitiza o conteúdo, persiste na base de dados relacional e retorna o currículo normalizado atualizado.

### Requirement: Editor com Preview e Renderização Segura no Frontend e Android
O Frontend Web e o aplicativo Android SHALL fornecer uma interface interativa para edição e visualização de currículo em Markdown com preview em tempo real, proteção contra injeção de scripts maliciosos (XSS) e renderização tipográfica padronizada.

#### Scenario: Edição e Visualização Prévia do Currículo
- **WHEN** o candidato digita ou formata o texto em Markdown no editor do perfil
- **THEN** o preview renderiza instantaneamente o HTML correspondente com cabeçalhos, listas, negritos e links de forma sanitizada.

### Requirement: Normalização Automática a Partir do Perfil Existente
O sistema SHALL disponibilizar funcionalidade para gerar automaticamente um currículo estruturado em Markdown com base nos dados preexistentes cadastrados no perfil do candidato (experiências, formação, skills e contatos).

#### Scenario: Geração Automática de Markdown
- **WHEN** um candidato que possui histórico de experiências no perfil solicita a normalização automática
- **THEN** o sistema compila os dados estruturados existentes gerando um documento Markdown padronizado e pré-preenchido no editor.

### Requirement: Indexação e Busca por Conteúdo do Currículo Normalizado
O motor de busca de candidatos SHALL indexar todos os termos, cargos, empresas, competências, certificações e objetivos profissionais contidos no currículo normalizado em Markdown, permitindo consultas avançadas por palavras-chave sem depender de buscas textuais brutas lentas.

#### Scenario: Busca de Candidato por Termos do Currículo
- **WHEN** um recrutador pesquisa por "Docker Kubernetes AWS" ou "Bacharel em Ciência da Computação"
- **THEN** o sistema encontra e lista os candidatos cujos currículos normalizados contêm os respectivos termos e tecnologias.
