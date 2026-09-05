<template>
  <div class="resume-editor-card">
    <div class="editor-header">
      <div class="header-info">
        <h3><i class="fa fa-file-text-o"></i> Currículo Normalizado em Markdown</h3>
        <p>Formate seu currículo com Markdown profissional. Ele será indexado com prioridade nas buscas de recrutadores.</p>
      </div>

      <div class="header-actions">
        <!-- Completeness Score Badge -->
        <div class="completeness-pill" :class="scoreClass">
          <i class="fa fa-tachometer"></i>
          <span>Completude: <strong>{{ completenessScore }}%</strong></span>
        </div>

        <!-- Botão Auto-Normalizar -->
        <button
          type="button"
          class="btn-auto-normalize"
          :disabled="isNormalizing"
          @click="handleAutoNormalize"
        >
          <i :class="isNormalizing ? 'fa fa-spinner fa-spin' : 'fa fa-magic'"></i>
          {{ isNormalizing ? 'Compilando...' : 'Normalizar do Perfil' }}
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="markdown-toolbar">
      <div class="toolbar-group">
        <button type="button" class="tool-btn" title="Título 1" @click="insertSyntax('# ', '')"><strong>H1</strong></button>
        <button type="button" class="tool-btn" title="Título 2" @click="insertSyntax('## ', '')"><strong>H2</strong></button>
        <button type="button" class="tool-btn" title="Título 3" @click="insertSyntax('### ', '')"><strong>H3</strong></button>
      </div>
      <div class="toolbar-divider"></div>
      <div class="toolbar-group">
        <button type="button" class="tool-btn" title="Negrito" @click="insertSyntax('**', '**')"><i class="fa fa-bold"></i></button>
        <button type="button" class="tool-btn" title="Itálico" @click="insertSyntax('*', '*')"><i class="fa fa-italic"></i></button>
        <button type="button" class="tool-btn" title="Lista" @click="insertSyntax('- ', '')"><i class="fa fa-list-ul"></i></button>
        <button type="button" class="tool-btn" title="Link" @click="insertSyntax('[Texto do Link](', ')')"><i class="fa fa-link"></i></button>
        <button type="button" class="tool-btn" title="Código" @click="insertSyntax('`', '`')"><i class="fa fa-code"></i></button>
      </div>
      <div class="toolbar-divider"></div>
      <div class="toolbar-group view-modes">
        <button
          type="button"
          class="mode-btn"
          :class="{ active: viewMode === 'edit' }"
          @click="viewMode = 'edit'"
        >
          <i class="fa fa-edit"></i> Editor
        </button>
        <button
          type="button"
          class="mode-btn"
          :class="{ active: viewMode === 'split' }"
          @click="viewMode = 'split'"
        >
          <i class="fa fa-columns"></i> Split
        </button>
        <button
          type="button"
          class="mode-btn"
          :class="{ active: viewMode === 'preview' }"
          @click="viewMode = 'preview'"
        >
          <i class="fa fa-eye"></i> Preview
        </button>
      </div>
    </div>

    <!-- Editor / Preview Area -->
    <div class="editor-workspace" :class="`mode-${viewMode}`">
      <!-- Textarea Editor -->
      <div v-show="viewMode === 'edit' || viewMode === 'split'" class="pane editor-pane">
        <textarea
          ref="textareaRef"
          v-model="markdownText"
          class="markdown-textarea"
          placeholder="# Nome Completo&#10;**Desenvolvedor Full Stack** | São Paulo, SP&#10;&#10;## Resumo Profissional&#10;Experiência sólida no desenvolvimento de sistemas web escaláveis...&#10;&#10;## Experiência Profissional&#10;### Tech Corp (2022 - Atual)&#10;- Desenvolvimento de APIs GraphQL em Node.js&#10;- Interfaces responsivas com Vue 3&#10;&#10;## Habilidades&#10;- TypeScript, Node.js, Vue.js, GraphQL, PostgreSQL"
          @input="calculateScore"
        ></textarea>
      </div>

      <!-- Live Preview -->
      <div v-show="viewMode === 'preview' || viewMode === 'split'" class="pane preview-pane">
        <div class="preview-content markdown-body" v-html="renderedHtml"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    candidateProfile?: any;
  }>(),
  {
    modelValue: '',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'scoreChange', score: number): void;
}>();

const viewMode = ref<'edit' | 'split' | 'preview'>('split');
const markdownText = ref(props.modelValue || '');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isNormalizing = ref(false);
const completenessScore = ref(0);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== markdownText.value) {
      markdownText.value = val || '';
      calculateScore();
    }
  }
);

watch(markdownText, (val) => {
  emit('update:modelValue', val);
  calculateScore();
});

const scoreClass = computed(() => {
  if (completenessScore.value >= 80) return 'score-high';
  if (completenessScore.value >= 50) return 'score-med';
  return 'score-low';
});

function calculateScore() {
  const md = markdownText.value;
  let score = 0;
  if (!md || md.trim().length === 0) {
    completenessScore.value = 0;
    emit('scoreChange', 0);
    return;
  }

  if (md.length >= 100) score += 20;
  if (/^#\s+.+/m.test(md)) score += 20;
  if (/##\s+(Resumo|Sobre|Objetivo)/i.test(md)) score += 20;
  if (/##\s+(Experiência|Histórico|Trajetória)/i.test(md)) score += 20;
  if (/##\s+(Habilidades|Competências|Skills|Formação|Educação)/i.test(md)) score += 20;

  completenessScore.value = score;
  emit('scoreChange', score);
}

function insertSyntax(prefix: string, suffix: string) {
  const el = textareaRef.value;
  if (!el) return;

  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;
  const selected = text.substring(start, end);

  const replacement = `${prefix}${selected}${suffix}`;
  markdownText.value = text.substring(0, start) + replacement + text.substring(end);

  setTimeout(() => {
    el.focus();
    el.setSelectionRange(start + prefix.length, end + prefix.length);
  }, 50);
}

// Conversor simples e seguro de Markdown para HTML
const renderedHtml = computed(() => {
  const raw = markdownText.value || '';
  if (!raw.trim()) {
    return '<p class="empty-preview-text">O preview renderizado do seu currículo aparecerá aqui...</p>';
  }

  // Sanitização de tags HTML perigosas
  let html = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Negrito e Itálico
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^[]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Listas
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

  // Quebras de linha e Parágrafos
  html = html.replace(/\n\n+/gim, '</p><p>');
  html = `<p>${html}</p>`;

  return html;
});

async function handleAutoNormalize() {
  isNormalizing.value = true;
  try {
    const profile = props.candidateProfile || {};
    const candidateId = profile.candidateId;
    let classicResume: any = null;
    if (candidateId) {
      try {
        const { resumesService } = await import('../services/resumes');
        const all = await resumesService.getAll();
        classicResume = (all.data || []).find((r: any) => String(r.candidate?.id || r.candidateId) === String(candidateId));
      } catch (e) {
        console.warn('Não foi possível carregar currículo para auto-normalizar:', e);
      }
    }

    const name = profile.name || profile.fullName || classicResume?.candidate?.name || '';
    const headline = profile.headline || profile.title || classicResume?.objective || '';
    const location = profile.location || (classicResume?.candidate?.locale ? `${classicResume.candidate.locale.city}, ${classicResume.candidate.locale.state}` : '');
    const about = profile.about || profile.summary || classicResume?.content || '';

    let compiled = '';
    if (name) {
      compiled += `# ${name}\n`;
    }
    if (headline || location) {
      compiled += `**${headline || 'Perfil Profissional'}**${location ? ` | ${location}` : ''}\n\n`;
    }
    if (about) {
      compiled += `## Resumo Profissional\n${about}\n\n`;
    }

    if (profile.inCareerTransition) {
      compiled += `## Transição de Carreira\n- **Objetivo Alvo:** ${profile.careerTransitionTarget || 'Nova Área de Atuação'}\n\n`;
    }

    // Experiências
    const experiences = (classicResume?.experiences && classicResume.experiences.length > 0) ? classicResume.experiences : (profile.experiences || []);
    if (experiences.length > 0) {
      compiled += `## Experiência Profissional\n`;
      for (const exp of experiences) {
        const title = exp.jobTitle || exp.title || '';
        const emp = exp.employerName || exp.company || '';
        const desc = exp.description || exp.responsibilities || '';
        if (title || emp) {
          compiled += `### ${title}${emp ? ` - ${emp}` : ''}\n`;
          if (desc) compiled += `- ${desc}\n\n`;
          else compiled += `\n`;
        }
      }
    }

    // Formação
    const educations = (classicResume?.educations && classicResume.educations.length > 0) ? classicResume.educations : (profile.educations || []);
    if (educations.length > 0) {
      compiled += `## Formação Acadêmica\n`;
      for (const edu of educations) {
        const qual = edu.qualification || '';
        const school = edu.schoolName || '';
        if (qual || school) {
          compiled += `### ${qual}${school ? ` - ${school}` : ''}\n`;
          if (edu.description) compiled += `- ${edu.description}\n\n`;
          else compiled += `\n`;
        }
      }
    }

    // Habilidades
    const skills = (classicResume?.skills && classicResume.skills.length > 0)
      ? classicResume.skills.map((s: any) => s.skillName || s)
      : (profile.skills || []);
    if (skills.length > 0) {
      compiled += `## Habilidades Técnicas\n`;
      compiled += `- ${skills.join(', ')}\n`;
    }

    markdownText.value = compiled;
    calculateScore();
  } finally {
    isNormalizing.value = false;
  }
}
</script>

<style scoped>
.resume-editor-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin-top: 24px;
}

.editor-header {
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-info h3 {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-info p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.completeness-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
}

.score-high {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.score-med {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.score-low {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-auto-normalize {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-auto-normalize:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.markdown-toolbar {
  padding: 10px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
  margin: 0 4px;
}

.tool-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #475569;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.tool-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.mode-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.mode-btn.active {
  background: #0f172a;
  color: #ffffff;
}

.editor-workspace {
  display: flex;
  min-height: 420px;
  height: 480px;
}

.pane {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}

.editor-pane {
  border-right: 1px solid #e2e8f0;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 18px 20px;
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #1e293b;
  resize: none;
  background: #fcfdfd;
}

.preview-pane {
  padding: 24px 28px;
  background: #ffffff;
}

.markdown-body h1 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
  margin-top: 0;
  margin-bottom: 14px;
}

.markdown-body h2 {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 18px;
  margin-bottom: 10px;
}

.markdown-body h3 {
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  margin-top: 12px;
  margin-bottom: 6px;
}

.markdown-body p {
  font-size: 14px;
  line-height: 1.65;
  color: #334155;
  margin-bottom: 10px;
}

.markdown-body ul {
  padding-left: 20px;
  margin-bottom: 12px;
}

.markdown-body li {
  font-size: 14px;
  color: #334155;
  margin-bottom: 4px;
}

.empty-preview-text {
  color: #94a3b8;
  font-style: italic;
}
</style>
