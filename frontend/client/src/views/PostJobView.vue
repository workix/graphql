<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Publicar Nova Vaga de Emprego</h1>
        <p>Preencha os dados abaixo para atrair os melhores talentos</p>
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
                <label>Título da Vaga *</label>
                <input type="text" v-model="title" class="form-control" placeholder="Ex: Desenvolvedor Senior Full Stack" required />
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Tipo de Contratação *</label>
                    <select v-model="employmentType" class="form-control" required>
                      <option value="CLT">CLT</option>
                      <option value="PJ">PJ</option>
                      <option value="CONTRATO_TEMPORARIO">Contrato Temporário</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Faixa Salarial (R$)</label>
                    <input type="text" v-model="salary" class="form-control" placeholder="Ex: 8.000 - 10.000" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Categorias da Vaga (Multi-Seleção)</label>
                <div class="category-checkboxes">
                  <label v-for="cat in availableCategories" :key="cat.value" class="checkbox-inline mr-3">
                    <input type="checkbox" :value="cat.value" v-model="selectedCategories" />
                    {{ cat.label }}
                  </label>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Cidade *</label>
                    <input type="text" v-model="city" class="form-control" placeholder="São Paulo" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Estado (UF) *</label>
                    <input type="text" v-model="state" class="form-control" placeholder="SP" required maxLength="2" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Descrição da Vaga *</label>
                <textarea v-model="description" class="form-control" rows="5" placeholder="Descreva as responsabilidades e desafios da posição..." required></textarea>
              </div>

              <div class="form-group">
                <label>Requisitos Exigidos *</label>
                <textarea v-model="requirements" class="form-control" rows="4" placeholder="Tecnologias, conhecimentos técnicos e diferenciais..." required></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="loading">
                <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Publicando...</span>
                <span v-else>Publicar Vaga</span>
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
import { jobsService } from '../services/jobs';

const title = ref('');
const employmentType = ref('CLT');
const selectedCategories = ref<string[]>([]);
const salary = ref('');
const city = ref('');
const state = ref('');
const description = ref('');
const requirements = ref('');

const availableCategories = [
  { value: 'MEIO_PERIODO', label: 'Meio Período' },
  { value: 'PRIMEIRA_OPORTUNIDADE', label: 'Primeira Oportunidade' },
  { value: 'ESTAGIO', label: 'Estágio' },
  { value: 'NOTURNO', label: 'Noturno' },
  { value: 'TEMPORARIO', label: 'Emprego Temporário' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'PERICULOSIDADE', label: 'Com Periculosidade' }
];

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const router = useRouter();

async function handleSubmit() {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const response = await jobsService.create({
      title: title.value,
      employmentType: employmentType.value,
      categories: selectedCategories.value,
      salary: salary.value,
      city: city.value,
      state: state.value,
      description: description.value,
      requirements: requirements.value
    });
    successMessage.value = 'Vaga publicada com sucesso!';
    setTimeout(() => {
      router.push(`/jobs/${response.data.id || ''}`);
    }, 1500);
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || err.message || 'Erro ao publicar vaga. Tente novamente.';
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
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}
</style>
