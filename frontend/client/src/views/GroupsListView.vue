<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Grupos e Comunidades Profissionais</h1>
        <p>Conecte-se com profissionais do mesmo nicho, troque experiências e expanda sua rede técnica</p>
      </div>
    </div>

    <div class="container section-padding">
      <!-- Search and Actions Bar -->
      <div class="groups-actions-bar d-flex justify-content-between align-items-center">
        <div class="search-box">
          <i class="fa fa-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar comunidades por nome ou tecnologia..."
            class="form-control"
          />
        </div>

        <button type="button" class="btn btn-primary" @click="showCreateModal = true">
          <i class="fa fa-plus-circle"></i> Criar Grupo
        </button>
      </div>

      <!-- Create Group Modal / Inline Form -->
      <div v-if="showCreateModal" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h3><i class="fa fa-users"></i> Criar Novo Grupo</h3>
            <button type="button" class="btn-close" @click="showCreateModal = false">&times;</button>
          </div>

          <form @submit.prevent="handleCreateGroup" class="modal-body">
            <div v-if="createError" class="alert alert-danger">{{ createError }}</div>

            <div class="form-group">
              <label>Nome do Grupo *</label>
              <input
                v-model="createForm.name"
                type="text"
                class="form-control"
                placeholder="Ex: Engenharia de Dados & Cloud"
                required
              />
            </div>

            <div class="form-group">
              <label>Descrição do Grupo</label>
              <textarea
                v-model="createForm.description"
                class="form-control"
                rows="3"
                placeholder="Explique o propósito, tópicos e regras da comunidade..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Privacidade</label>
              <select v-model="createForm.privacy" class="form-control">
                <option value="PUBLIC">Público (Qualquer profissional pode ingressar)</option>
                <option value="PRIVATE">Privado (Requer aprovação de moderador)</option>
              </select>
            </div>

            <div class="modal-footer d-flex justify-content-end gap-10">
              <button type="button" class="btn btn-default" @click="showCreateModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <i class="fa" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-check'"></i>
                {{ isSubmitting ? 'Criando...' : 'Criar Comunidade' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="groupsStore.isLoading" class="loading-state">
        <i class="fa fa-spinner fa-spin"></i> Carregando comunidades...
      </div>

      <!-- Groups Grid -->
      <div v-else-if="filteredGroups.length > 0" class="row margin-top-24">
        <div
          v-for="group in filteredGroups"
          :key="group.id"
          class="col-md-4 col-sm-6 col-xs-12 margin-bottom-24"
        >
          <div class="group-card">
            <div class="group-banner">
              <span class="privacy-badge" :class="group.privacy === 'PRIVATE' ? 'badge-private' : 'badge-public'">
                <i class="fa" :class="group.privacy === 'PRIVATE' ? 'fa-lock' : 'fa-globe'"></i>
                {{ group.privacy === 'PRIVATE' ? 'Privado' : 'Público' }}
              </span>
            </div>

            <div class="group-body">
              <div class="group-avatar">
                <i class="fa fa-users"></i>
              </div>

              <h4 class="group-title">{{ group.name }}</h4>
              <p class="group-desc">{{ group.description || 'Comunidade profissional de tecnologia e networking.' }}</p>

              <div class="group-footer">
                <router-link :to="`/groups/${group.id}`" class="btn btn-block btn-outline-primary">
                  <i class="fa fa-arrow-right"></i> Acessar Comunidade
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-box">
        <i class="fa fa-users"></i>
        <h3>Nenhum grupo encontrado</h3>
        <p>Nenhuma comunidade corresponde à sua pesquisa. Que tal criar a primeira?</p>
        <button type="button" class="btn btn-primary margin-top-10" @click="showCreateModal = true">
          <i class="fa fa-plus"></i> Criar Grupo Agora
        </button>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useGroupsStore from '../stores/groups';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const router = useRouter();
const groupsStore = useGroupsStore();

const searchQuery = ref('');
const showCreateModal = ref(false);
const isSubmitting = ref(false);
const createError = ref('');

const createForm = reactive({
  name: '',
  description: '',
  privacy: 'PUBLIC'
});

onMounted(async () => {
  await groupsStore.fetchGroups();
});

const filteredGroups = computed(() => {
  if (!searchQuery.value.trim()) return groupsStore.groupsList;
  const q = searchQuery.value.toLowerCase();
  return groupsStore.groupsList.filter(
    (g) => g.name.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q))
  );
});

async function handleCreateGroup() {
  createError.value = '';
  if (!createForm.name.trim()) {
    createError.value = 'Informe o nome da comunidade.';
    return;
  }

  isSubmitting.value = true;
  try {
    const created = await groupsStore.createGroup(
      createForm.name,
      createForm.description,
      createForm.privacy
    );
    showCreateModal.value = false;
    createForm.name = '';
    createForm.description = '';
    createForm.privacy = 'PUBLIC';

    if (created?.id) {
      router.push(`/groups/${created.id}`);
    }
  } catch (err: any) {
    createError.value = err.message || 'Erro ao criar grupo.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.page-wrapper {
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 40px 0;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
}

.section-padding {
  padding-bottom: 60px;
}

.groups-actions-bar {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  gap: 16px;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-box i {
  position: absolute;
  left: 14px;
  top: 12px;
  color: #94a3b8;
}

.search-box input {
  padding-left: 38px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.margin-top-24 {
  margin-top: 24px;
}

.margin-bottom-24 {
  margin-bottom: 24px;
}

.margin-top-10 {
  margin-top: 10px;
}

.gap-10 {
  gap: 10px;
}

/* Group Card */
.group-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.group-banner {
  height: 60px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  position: relative;
  padding: 10px 14px;
}

.privacy-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-public {
  background: rgba(0, 0, 0, 0.25);
}

.badge-private {
  background: rgba(220, 38, 38, 0.8);
}

.group-body {
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.group-avatar {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #ffffff;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #0284c7;
  margin-top: -24px;
  margin-bottom: 12px;
}

.group-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.group-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.4;
  flex: 1;
}

.group-footer {
  margin-top: auto;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-header h3 i {
  color: #0284c7;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  margin-top: 20px;
}

.loading-state,
.empty-state-box {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-state-box i {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 14px;
}

.empty-state-box h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}
</style>
