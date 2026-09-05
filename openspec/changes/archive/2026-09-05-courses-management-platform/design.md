## Context

O ecossistema Workix já conta com modelos básicos de `Course`, `CourseLesson`, `CourseEnrollment` e `CourseCompletion`, além de um storage server para upload de mídias (`/api/upload`). No entanto, a experiência atual necessitava de uma reformulação completa para atingir a riqueza visual, funcional e pedagógica de plataformas como a Udemy: seções/módulos, suporte a vídeos e arquivos anexados para download, múltiplos provedores (Workix vs. Empresas Premium) e player interativo com controle fino de progresso.

## Goals / Non-Goals

**Goals:**
- Prover arquitetura de dados e APIs GraphQL robustas para cursos estruturados em seções e lições com suporte a vídeos (streaming/embed) e arquivos anexos (PDFs, slides, arquivos de código).
- Permitir que empresas com plano premium cadastrem, gerenciem e ofereçam cursos aos candidatos e comunidade.
- Desenvolver interface de catálogo e landing page de cursos no frontend client com visual moderno estilo Udemy.
- Criar um player LMS de alta imersão com menu lateral retrátil, acompanhamento de conclusão por aula, download de materiais e emissão de certificados.

**Non-Goals:**
- Processamento pesado de transcodificação de vídeo no backend (utilizaremos streaming via URLs diretas, CDNs ou embeds seguros do storage server / YouTube / Vimeo).
- Sistema complexo de pagamento por curso avulso (o acesso é concedido via assinatura da plataforma ou bolsas das empresas premium).

## Decisions

1. **Estrutura de Seções e Lições**:
   - *Decisão*: Manter uma modelagem flexível onde cada `CourseLesson` possui um `section_name` e `order_index`. No GraphQL, os resolvers agrupam as lições por seções automaticamente, simplificando a persistência e fornecendo uma estrutura hierárquica perfeita para a UI da Udemy (`sections: [{ name, lessons: [...] }]`).
   - *Alternativa considerada*: Criar uma nova tabela `course_sections`. Optou-se por agrupar por `section_name` e `order_index` para manter consultas extremamente rápidas e compatibilidade direta com a modelagem existente.

2. **Tipos de Conteúdo e Materiais da Lição**:
   - *Decisão*: Cada lição suportará `content_type` (`VIDEO`, `ARTICLE`, `DOCUMENT`), `video_url` para reprodução contínua e `attachment_url` / `attachment_name` para download imediato de arquivos de apoio.
   - *Alternativa considerada*: Tabela separada `lesson_attachments`. Para o escopo atual, campos de anexo direto na lição oferecem menor latência e facilidade de manipulação.

3. **Multi-Provedor (Plataforma vs. Empresas Premium)**:
   - *Decisão*: Campo `provider_type` (`PLATFORM` ou `COMPANY`) e chave estrangeira `company_id`. No frontend, selos visuais diferenciam cursos oficiais Workix de cursos patrocinados por empresas. Na mutação `createCourse`, apenas empresas com assinatura válida podem publicar cursos com `provider_type = COMPANY`.

4. **Player de Lições com Layout Imersivo**:
   - *Decisão*: Interface em duas colunas: área principal com player de vídeo responsivo e abas de Recursos/Downloads e Descrição; coluna lateral (colapsável) com acordeão de seções, checklist de lições concluídas e barra de progresso total.

## Risks / Trade-offs

- [Upload de arquivos grandes de vídeo] → Mitigação: Suporte flexível a links externos (YouTube/Vimeo/S3) e upload direto via `/api/upload` com validação de formato e segurança (`file_security_validator.ts`).
- [Controle de progresso concorrente] → Mitigação: Registro idempotente de conclusão de aula na tabela de progresso/matrícula.
