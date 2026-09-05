<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog-box">
      <div class="modal-header-custom">
        <h3 class="modal-title">
          <i class="fa fa-graduation-cap"></i> Criar Novo Curso Corporativo
        </h3>
        <button type="button" class="btn-close-modal" @click="$emit('close')">
          <i class="fa fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body-custom">
        <div class="form-group">
          <label>Título do Curso *</label>
          <input
            v-model="form.title"
            type="text"
            class="form-control"
            placeholder="Ex: Treinamento Avançado de Arquitetura de Software"
            required
          />
        </div>

        <div class="form-group">
          <label>Descrição do Curso *</label>
          <textarea
            v-model="form.description"
            class="form-control"
            rows="3"
            placeholder="Descreva a ementa, objetivos e público-alvo do treinamento..."
            required
          ></textarea>
        </div>

        <div class="row">
          <div class="col-md-6 col-sm-12">
            <div class="form-group">
              <label>Categoria</label>
              <select v-model="form.category" class="form-control">
                <option value="Tecnologia">Tecnologia & Desenvolvimento</option>
                <option value="Dados & IA">Dados & Inteligência Artificial</option>
                <option value="Design">Design & UX</option>
                <option value="Gestão">Gestão & Liderança</option>
                <option value="Marketing">Marketing & Vendas</option>
              </select>
            </div>
          </div>

          <div class="col-md-6 col-sm-12">
            <div class="form-group">
              <label>Nível de Dificuldade</label>
              <select v-model="form.level" class="form-control">
                <option value="BEGINNER">Iniciante</option>
                <option value="INTERMEDIATE">Intermediário</option>
                <option value="ADVANCED">Avançado</option>
                <option value="ALL_LEVELS">Todos os Níveis</option>
              </select>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 col-sm-12">
            <div class="form-group">
              <label>Carga Horária Estimada (Horas)</label>
              <input
                v-model.number="form.durationHours"
                type="number"
                step="0.5"
                min="0.5"
                class="form-control"
                placeholder="Ex: 8.5"
              />
            </div>
          </div>

          <div class="col-md-6 col-sm-12">
            <div class="form-group">
              <label>Link do Vídeo Introdutório (Embed/MP4)</label>
              <input
                v-model="form.videoUrl"
                type="url"
                class="form-control"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>O que o aluno aprenderá (Tópicos principais)</label>
          <textarea
            v-model="form.whatYouWillLearn"
            class="form-control"
            rows="2"
            placeholder="Ex: Padrões de microsserviços, Clean Architecture, APIs escaláveis..."
          ></textarea>
        </div>

        <div class="form-group">
          <label>Pré-requisitos</label>
          <input
            v-model="form.requirements"
            type="text"
            class="form-control"
            placeholder="Ex: Conhecimento intermediário em TypeScript e bancos relacionais"
          />
        </div>

        <div v-if="errorMessage" class="alert alert-danger margin-top-12">
          <i class="fa fa-exclamation-triangle"></i> {{ errorMessage }}
        </div>

        <div class="modal-footer-custom">
          <button type="button" class="btn btn-default" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="fa fa-spinner fa-spin"></i>
            <span v-else><i class="fa fa-check"></i> Publicar Curso Corporativo</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useLearningStore from '../stores/learning';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'created'): void;
}>();

const learningStore = useLearningStore();
const authStore = useAuthStore();

const isSubmitting = ref(false);
const errorMessage = ref('');

const form = ref({
  title: '',
  description: '',
  category: 'Tecnologia',
  level: 'INTERMEDIATE',
  durationHours: 6.0,
  videoUrl: '',
  whatYouWillLearn: '',
  requirements: ''
});

async function handleSubmit() {
  if (!form.value.title.trim() || !form.value.description.trim()) {
    errorMessage.value = 'Preencha todos os campos obrigatórios.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const course = await learningStore.createCompanyCourse({
      title: form.value.title,
      description: form.value.description,
      category: form.value.category,
      level: form.value.level,
      durationHours: form.value.durationHours,
      whatYouWillLearn: form.value.whatYouWillLearn,
      requirements: form.value.requirements,
      companyId: authStore.user?.id || 1
    });

    if (course && form.value.videoUrl) {
      await learningStore.addLessonToCourse(course.id, {
        title: '1. Apresentação e Boas-Vindas ao Treinamento',
        sectionName: 'Seção 1: Introdução ao Curso',
        contentType: 'VIDEO',
        videoUrl: form.value.videoUrl,
        durationMinutes: 10,
        description: form.value.description
      });
    }

    emit('created');
    emit('close');
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao criar o curso.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 20px;
}

.modal-dialog-box {
  background: #ffffff;
  border-radius: 14px;
  width: 100%;
  max-width: 650px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header-custom {
  padding: 18px 24px;
  background: #0f172a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-title i {
  color: #38bdf8;
}

.btn-close-modal {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
}

.btn-close-modal:hover {
  color: #ffffff;
}

.modal-body-custom {
  padding: 24px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  border-color: #0284c7;
}

.modal-footer-custom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.btn {
  padding: 9px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.btn-default {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-primary {
  background: #0284c7;
  border: none;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #0369a1;
}

.margin-top-12 {
  margin-top: 12px;
}
</style>
