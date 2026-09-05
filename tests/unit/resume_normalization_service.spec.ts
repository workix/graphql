import { resumeNormalizationService } from '../../src/services/resume_normalization.service';

describe('Resume Normalization and Markdown Sanitization Service', () => {
  it('deve sanitizar tags de script e eventos perigosos de Markdown evitando XSS', () => {
    const maliciousMarkdown = `
# Nome do Candidato
<script>alert('xss')</script>
<iframe src="http://malicious.com"></iframe>
[Link](javascript:stealData())
<img src="x" onerror="alert(1)" />
<button onclick="hack()">Clique</button>

## Resumo Profissional
Desenvolvedor de Software Full Stack com 5 anos de experiência.
    `;

    const sanitized = resumeNormalizationService.sanitizeMarkdown(maliciousMarkdown);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('<iframe>');
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('onerror=');
    expect(sanitized).not.toContain('onclick=');
    expect(sanitized).toContain('# Nome do Candidato');
    expect(sanitized).toContain('## Resumo Profissional');
  });

  it('deve extrair sumário, habilidades e objetivos a partir do Markdown', () => {
    const markdown = `
# Carlos Pereira
*Objetivo: Transição para Engenharia de Dados*

## Resumo Profissional
Especialista em automação de processos com Python e SQL.

## Habilidades e Tecnologias
- Python
- SQL
- Apache Spark
- Docker
- AWS

## Objetivos
Atuar como Engenheiro de Dados Pleno em projetos de alta escala.
    `;

    const parsed = resumeNormalizationService.parseMarkdown(markdown);

    expect(parsed.summary).toBe('Especialista em automação de processos com Python e SQL.');
    expect(parsed.skills).toContain('Python');
    expect(parsed.skills).toContain('SQL');
    expect(parsed.skills).toContain('Apache Spark');
    expect(parsed.skills).toContain('Docker');
    expect(parsed.careerGoals).toContain('Atuar como Engenheiro de Dados Pleno');
    expect(parsed.completenessScore).toBeGreaterThanOrEqual(70);
  });
});
