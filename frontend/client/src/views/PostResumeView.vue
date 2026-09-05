<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Cadastrar / Atualizar Currículo</h1>
        <p>Aumente suas chances de contratação pelas melhores empresas</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <div class="form-box">
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Título Profissional *</label>
                <input type="text" v-model="title" class="form-control" placeholder="Ex: Desenvolvedor Front-end Vue.js" required />
              </div>

              <div class="form-group">
                <label>Resumo Profissional *</label>
                <textarea v-model="summary" class="form-control" rows="4" placeholder="Breve resumo da sua carreira e objetivos..." required></textarea>
              </div>

              <div class="form-group">
                <label>Experiências Profissionais</label>
                <textarea v-model="experience" class="form-control" rows="4" placeholder="Cargos anteriores, empresas e períodos..."></textarea>
              </div>

              <div class="form-group">
                <label>Formação Acadêmica</label>
                <textarea v-model="education" class="form-control" rows="3" placeholder="Cursos, graduações e certificações..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="loading">
                <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Salvando...</span>
                <span v-else>Salvar Currículo</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import { resumesService } from '../services/resumes';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const title = ref('');
const summary = ref('');
const experience = ref('');
const education = ref('');
const carrerLevel = ref('SENIOR');
const presence = ref('REMOTE');

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

function parseExperiences(text: string) {
  if (!text || !text.trim()) return [];
  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  
  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const headerLine = lines[0] || '';
    const bodyLines = lines.slice(1).join('\n').trim();

    let jobTitle = headerLine;
    let employerName = 'Empresa';

    if (headerLine.includes(' - ')) {
      const parts = headerLine.split(' - ');
      jobTitle = parts[0].trim();
      employerName = parts.slice(1).join(' - ').trim();
    } else if (headerLine.includes(' – ')) {
      const parts = headerLine.split(' – ');
      jobTitle = parts[0].trim();
      employerName = parts.slice(1).join(' – ').trim();
    } else if (headerLine.includes(' | ')) {
      const parts = headerLine.split(' | ');
      jobTitle = parts[0].trim();
      employerName = parts.slice(1).join(' | ').trim();
    } else if (headerLine.toLowerCase().includes(' na ')) {
      const parts = headerLine.split(/ na /i);
      jobTitle = parts[0].trim();
      employerName = parts.slice(1).join(' na ').trim();
    } else if (headerLine.toLowerCase().includes(' no ')) {
      const parts = headerLine.split(/ no /i);
      jobTitle = parts[0].trim();
      employerName = parts.slice(1).join(' no ').trim();
    } else if (headerLine.toLowerCase().includes(' em ')) {
      const parts = headerLine.split(/ em /i);
      jobTitle = parts[0].trim();
      employerName = parts.slice(1).join(' em ').trim();
    }

    const description = bodyLines || headerLine;
    const responsibilities = bodyLines || description;
    
    const yearMatch = block.match(/\b(19\d\d|20\d\d)\b/);
    const startDate = yearMatch ? `${yearMatch[1]}-01-01` : '2020-01-01';

    return {
      jobTitle: jobTitle || 'Cargo',
      employerName: employerName || 'Empresa',
      description: description || 'Atuação profissional',
      responsibilities: responsibilities || 'Responsabilidades no cargo',
      startDate,
      endDate: null
    };
  });
}

function parseEducations(text: string) {
  if (!text || !text.trim()) return [];
  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const headerLine = lines[0] || '';
    const bodyLines = lines.slice(1).join('\n').trim();

    let schoolName = 'Instituição de Ensino';
    let qualification = headerLine;

    if (headerLine.includes(' - ')) {
      const parts = headerLine.split(' - ');
      schoolName = parts[0].trim();
      qualification = parts.slice(1).join(' - ').trim();
    } else if (headerLine.includes(' – ')) {
      const parts = headerLine.split(' – ');
      schoolName = parts[0].trim();
      qualification = parts.slice(1).join(' – ').trim();
    } else if (headerLine.includes(' | ')) {
      const parts = headerLine.split(' | ');
      schoolName = parts[0].trim();
      qualification = parts.slice(1).join(' | ').trim();
    } else if (headerLine.toLowerCase().includes(' na ')) {
      const parts = headerLine.split(/ na /i);
      qualification = parts[0].trim();
      schoolName = parts.slice(1).join(' na ').trim();
    } else if (headerLine.toLowerCase().includes(' no ')) {
      const parts = headerLine.split(/ no /i);
      qualification = parts[0].trim();
      schoolName = parts.slice(1).join(' no ').trim();
    } else if (headerLine.toLowerCase().includes(' em ')) {
      const parts = headerLine.split(/ em /i);
      qualification = parts[0].trim();
      schoolName = parts.slice(1).join(' em ').trim();
    }

    const description = bodyLines || qualification;
    const yearMatch = block.match(/\b(19\d\d|20\d\d)\b/);
    const startDate = yearMatch ? `${yearMatch[1]}-01-01` : '2018-01-01';

    return {
      schoolName: schoolName || 'Instituição',
      qualification: qualification || 'Formação / Curso',
      description: description || 'Formação acadêmica',
      startDate,
      endDate: null
    };
  });
}

onMounted(async () => {
  const currentCandidateId = authStore.user?.candidateId || authStore.user?.id || 1;
  try {
    const res = await resumesService.getAll();
    const myResume = (res.data || []).find((r: any) => 
      String(r.candidate?.id || r.candidateId) === String(currentCandidateId)
    );
    if (myResume) {
      title.value = myResume.objective || '';
      summary.value = myResume.content || '';
      if (myResume.carrerLevel) carrerLevel.value = myResume.carrerLevel;
      if (myResume.presence) presence.value = myResume.presence;
      if (myResume.experiences && myResume.experiences.length > 0) {
        experience.value = myResume.experiences.map((e: any) => {
          const job = e.jobTitle || '';
          const comp = e.employerName ? ` - ${e.employerName}` : '';
          const desc = e.description || e.responsibilities ? `\n${e.description || e.responsibilities}` : '';
          return `${job}${comp}${desc}`.trim();
        }).join('\n\n');
      }
      if (myResume.educations && myResume.educations.length > 0) {
        education.value = myResume.educations.map((e: any) => {
          const school = e.schoolName || '';
          const qual = e.qualification ? ` - ${e.qualification}` : '';
          const desc = e.description && e.description !== qual ? `\n${e.description}` : '';
          return `${school}${qual}${desc}`.trim();
        }).join('\n\n');
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar currículo prévio:', e);
  }
});

async function handleSubmit() {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  const currentCandidateId = authStore.user?.candidateId || authStore.user?.id || 1;

  const parsedExperiences = parseExperiences(experience.value);
  const parsedEducations = parseEducations(education.value);

  try {
    await resumesService.create({
      objective: title.value,
      content: summary.value,
      carrerLevel: carrerLevel.value,
      presence: presence.value,
      candidateId: currentCandidateId,
      experiences: parsedExperiences,
      educations: parsedEducations
    });
    successMessage.value = 'Currículo salvo com sucesso via GraphQL!';
    setTimeout(() => {
      router.push('/profile/edit');
    }, 1500);
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar currículo.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page-header {
  background: #1e293b;
  color: #fff;
  padding: 40px 0;
}
.section-padding {
  padding: 50px 0;
}
.form-box {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 30px;
}
</style>
