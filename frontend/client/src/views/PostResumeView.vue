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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import { resumesService } from '../services/resumes';

const title = ref('');
const summary = ref('');
const experience = ref('');
const education = ref('');

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const router = useRouter();

async function handleSubmit() {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await resumesService.createOrUpdate({
      title: title.value,
      summary: summary.value,
      experience: experience.value,
      education: education.value
    });
    successMessage.value = 'Currículo salvo com sucesso!';
    setTimeout(() => {
      router.push('/candidates');
    }, 1500);
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Erro ao salvar currículo.';
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
