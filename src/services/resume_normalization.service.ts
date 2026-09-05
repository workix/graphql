import { NormalizedResume, Candidate, Resume, ResumeExperience, ResumeEducation, ResumeSkill } from '../models';

export interface ParsedResumeData {
  summary: string | null;
  skills: string[];
  careerGoals: string | null;
  completenessScore: number;
}

export class ResumeNormalizationService {

  /**
   * Sanitiza o Markdown de entrada contra scripts maliciosos e tags inseguras (XSS).
   */
  public sanitizeMarkdown(rawMarkdown: string): string {
    if (!rawMarkdown) return '';

    return rawMarkdown
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
      .replace(/javascript:[^"'\s)]+/gi, '')
      .replace(/onload\s*=/gi, '')
      .replace(/onerror\s*=/gi, '')
      .replace(/onclick\s*=/gi, '');
  }

  /**
   * Extrai dados estruturados a partir do conteúdo Markdown.
   */
  public parseMarkdown(rawMarkdown: string): ParsedResumeData {
    const sanitized = this.sanitizeMarkdown(rawMarkdown);
    const lines = sanitized.split('\n');

    let summary: string | null = null;
    let careerGoals: string | null = null;
    const skillsSet = new Set<string>();

    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const header = trimmed.replace(/^#+\s*/, '').toLowerCase();
        if (header.includes('resumo') || header.includes('sobre') || header.includes('perfil')) {
          currentSection = 'summary';
        } else if (header.includes('habilidade') || header.includes('skill') || header.includes('competência') || header.includes('tecnologia')) {
          currentSection = 'skills';
        } else if (header.includes('objetivo') || header.includes('meta')) {
          currentSection = 'goals';
        } else {
          currentSection = 'other';
        }
        continue;
      }

      if (!trimmed) continue;

      if (currentSection === 'summary' && !summary) {
        summary = trimmed;
      } else if (currentSection === 'goals' && !careerGoals) {
        careerGoals = trimmed;
      } else if (currentSection === 'skills') {
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const skillItem = trimmed.replace(/^[-*]\s*/, '').trim();
          if (skillItem) skillsSet.add(skillItem);
        } else {
          const parts = trimmed.split(/[,;|]/).map(s => s.trim()).filter(Boolean);
          parts.forEach(p => skillsSet.add(p));
        }
      }
    }

    const skills = Array.from(skillsSet);
    const completenessScore = this.calculateCompletenessScore(sanitized, skills, summary, careerGoals);

    return {
      summary,
      skills,
      careerGoals,
      completenessScore
    };
  }

  /**
   * Calcula a pontuação de preenchimento (0 a 100).
   */
  public calculateCompletenessScore(
    markdown: string,
    skills: string[],
    summary: string | null,
    careerGoals: string | null
  ): number {
    let score = 0;
    if (markdown && markdown.length > 50) score += 20;
    if (markdown && markdown.length > 200) score += 20;
    if (summary) score += 20;
    if (skills && skills.length >= 3) score += 20;
    if (careerGoals) score += 10;
    if (markdown.toLowerCase().includes('experiência') || markdown.toLowerCase().includes('histórico')) score += 10;
    return Math.min(100, score);
  }

  /**
   * Compila um documento Markdown padronizado a partir dos dados do perfil e currículo clássico.
   */
  public async compileFromCandidateProfile(candidateId: number): Promise<string> {
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) throw new Error(`Candidato não encontrado para o ID ${candidateId}`);

    const resume = await Resume.findOne({
      where: { candidate_id: candidateId },
      include: [
        { model: ResumeExperience, as: 'experiences' },
        { model: ResumeEducation, as: 'educations' },
        { model: ResumeSkill, as: 'skills' }
      ]
    });

    const parts: string[] = [];
    parts.push(`# ${candidate.name}`);
    if (candidate.career_transition_target) {
      parts.push(`*Objetivo: Transição de Carreira para ${candidate.career_transition_target}*`);
    } else if (candidate.looking_for_job) {
      parts.push(`*Disponível para novas oportunidades de trabalho*`);
    }
    parts.push('');

    // Resumo
    parts.push('## Resumo Profissional');
    if (resume?.content) {
      parts.push(resume.content);
    } else {
      parts.push('Profissional com sólida atuação no mercado e foco em desenvolvimento contínuo.');
    }
    parts.push('');

    // Experiências
    if (resume?.experiences && resume.experiences.length > 0) {
      parts.push('## Experiências Profissionais');
      for (const exp of resume.experiences) {
        parts.push(`### ${exp.job_title || 'Cargo'} na ${exp.employer_name || 'Empresa'}`);
        if (exp.responsibilities) parts.push(`**Responsabilidades:** ${exp.responsibilities}`);
        if (exp.description) parts.push(exp.description);
        parts.push('');
      }
    }

    // Formação
    if (resume?.educations && resume.educations.length > 0) {
      parts.push('## Formação Acadêmica');
      for (const edu of resume.educations) {
        parts.push(`- **${edu.qualification || 'Curso'}** — ${edu.school_name || 'Instituição'}`);
      }
      parts.push('');
    }

    // Habilidades
    if (resume?.skills && resume.skills.length > 0) {
      parts.push('## Habilidades e Tecnologias');
      for (const skill of resume.skills) {
        parts.push(`- ${skill.skill_name || 'Habilidade'}`);
      }
      parts.push('');
    }

    return parts.join('\n');
  }

  /**
   * Salva e normaliza o currículo Markdown do candidato.
   */
  public async saveNormalizedResume(candidateId: number, rawMarkdown: string): Promise<any> {
    const sanitizedMarkdown = this.sanitizeMarkdown(rawMarkdown);
    const parsed = this.parseMarkdown(sanitizedMarkdown);

    let [record, created] = await NormalizedResume.findOrCreate({
      where: { candidate_id: candidateId },
      defaults: {
        candidate_id: candidateId,
        raw_markdown: sanitizedMarkdown,
        summary: parsed.summary,
        skills: JSON.stringify(parsed.skills),
        career_goals: parsed.careerGoals,
        completeness_score: parsed.completenessScore
      }
    });

    if (!created) {
      await record.update({
        raw_markdown: sanitizedMarkdown,
        summary: parsed.summary,
        skills: JSON.stringify(parsed.skills),
        career_goals: parsed.careerGoals,
        completeness_score: parsed.completenessScore
      });
    }

    return record;
  }
}

export const resumeNormalizationService = new ResumeNormalizationService();
