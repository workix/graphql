# Proposta: Fase 2 — Diferenciação Profissional (`linkedin-phase-2-professional-core`)

## 1. Contexto e Objetivos

Esta proposta implementa a **Fase 2 (Diferenciação Profissional)** da paridade técnica com a plataforma LinkedIn. O objetivo é fornecer o ecossistema corporativo e de talentos, permitindo a criação de **Páginas de Empresa**, publicação e candidatura a **Vagas Estruturadas com calculador de Match de Competências**, **Endossos de Competências e Recomendações Profissionais**, e **Feed de Notícias Algorítmico**.

## 2. Escopo das Funcionalidades

1. **Páginas de Empresa (`company_pages`, `company_admins`, `company_followers`)**:
   - Criação e gestão de Company Pages com marca, setor, tamanho e administradores.
   - Vínculo de seguidores e empregados à empresa.
2. **Vagas Estruturadas & Algoritmo de Match (`job_postings`, `job_applications`)**:
   - Cadastro de vagas vinculadas à empresa com competências exigidas.
   - Processo de candidatura rápida e cálculo percentual de match de skills entre candidato e vaga.
3. **Endossos de Competências e Recomendações (`skill_endorsements`, `recommendations`)**:
   - Validação social de competências por conexões de 1º grau.
   - Escrita, aceite e exibição de recomendações profissionais no perfil.
4. **Feed Algorítmico & Conteúdo em Destaque (`featured_items`)**:
   - Seção de destaques no perfil do usuário.
   - Algoritmo de ranqueamento de feed por engajamento e relevância de rede.

## 3. Critérios de Aceite e Qualidade
- **TDD (Red-Green-Refactor)** para cada modelo, repositório e resolver.
- **100% de Cobertura de Testes** validada no Jest.
- Commits incrementais em **baby steps** com autoria `Felipe Rodrigues Michetti <frmichetti@gmail.com>`.
