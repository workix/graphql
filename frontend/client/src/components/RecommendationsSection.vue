<template>
  <div class="recommendations-card">
    <div class="card-header-bar d-flex justify-content-between align-items-center">
      <h3><i class="fa fa-quote-left"></i> Recomendações</h3>
      <button
        v-if="!isOwnProfile"
        type="button"
        class="btn btn-sm btn-outline-primary"
        @click="showWriteModal = !showWriteModal"
      >
        <i class="fa" :class="showWriteModal ? 'fa-minus' : 'fa-pencil'"></i>
        {{ showWriteModal ? 'Cancelar' : 'Recomendar Profissional' }}
      </button>
    </div>

    <div class="card-body">
      <!-- Write Recommendation Box -->
      <div v-if="showWriteModal" class="write-recommendation-box">
        <h4>Escrever uma recomendação para este profissional</h4>
        <form @submit.prevent="handleSendRecommendation">
          <div class="form-group">
            <textarea
              v-model="recommendationText"
              class="form-control"
              rows="4"
              placeholder="Descreva pontos fortes, colaboração em projetos, liderança ou resultados atingidos..."
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="isSending">
            <i v-if="isSending" class="fa fa-spinner fa-spin"></i>
            <i v-else class="fa fa-paper-plane"></i>
            {{ isSending ? 'Enviando...' : 'Enviar Recomendação' }}
          </button>
        </form>
      </div>

      <!-- Pending Moderation (Only shown to profile owner) -->
      <div v-if="isOwnProfile && pendingRecommendations.length > 0" class="pending-moderation-box">
        <h4><i class="fa fa-clock-o"></i> Recomendações Aguardando Sua Aprovação ({{ pendingRecommendations.length }})</h4>
        <div
          v-for="rec in pendingRecommendations"
          :key="rec.id"
          class="pending-rec-item"
        >
          <p class="rec-content">"{{ rec.content }}"</p>
          <span class="rec-meta">Enviada por Profissional #{{ rec.recommenderId }}</span>
          <div class="moderation-actions">
            <button class="btn btn-success btn-xs" @click="handleModerate(rec.id, true)">
              <i class="fa fa-check"></i> Aceitar e Exibir no Perfil
            </button>
            <button class="btn btn-danger btn-xs" @click="handleModerate(rec.id, false)">
              <i class="fa fa-times"></i> Recusar
            </button>
          </div>
        </div>
      </div>

      <!-- Accepted Recommendations Stream -->
      <div v-if="displayedRecommendations.length > 0" class="recommendations-list">
        <div
          v-for="rec in displayedRecommendations"
          :key="rec.id"
          class="recommendation-item"
        >
          <div class="rec-author-avatar">
            <i class="fa fa-user"></i>
          </div>
          <div class="rec-body">
            <h4 class="rec-author-name">Profissional #{{ rec.recommenderId }}</h4>
            <p class="rec-quote">"{{ rec.content }}"</p>
            <span class="rec-date">{{ formatDate(rec.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-recommendations">
        <p>Nenhuma recomendação pública ainda. Recomende este colega para destacar suas realizações profissionais!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import useEndorsementsStore from '../stores/endorsements';

const props = defineProps<{
  userId: string | number;
  isOwnProfile: boolean;
}>();

const endorsementsStore = useEndorsementsStore();
const showWriteModal = ref(false);
const recommendationText = ref('');
const isSending = ref(false);

onMounted(() => {
  endorsementsStore.fetchRecommendations(props.userId);
});

const displayedRecommendations = computed(() => {
  if (props.isOwnProfile) {
    return endorsementsStore.acceptedRecommendations;
  }
  // No perfil público, exibir aceitas ou lista geral retornada
  return endorsementsStore.recommendations.filter(r => r.status === 'ACCEPTED' || !r.status);
});

const pendingRecommendations = computed(() => endorsementsStore.pendingRecommendations);

async function handleSendRecommendation() {
  if (!recommendationText.value.trim()) return;
  isSending.value = true;
  try {
    await endorsementsStore.sendRecommendation(props.userId, recommendationText.value);
    recommendationText.value = '';
    showWriteModal.value = false;
    alert('Recomendação enviada com sucesso! Ela será exibida assim que for aceita pelo usuário.');
  } catch (err: any) {
    alert(err.message || 'Erro ao enviar recomendação.');
  } finally {
    isSending.value = false;
  }
}

async function handleModerate(id: string | number, accept: boolean) {
  await endorsementsStore.moderateRecommendation(id, accept);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Recentemente';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.recommendations-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card-header-bar {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.card-header-bar h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header-bar h3 i {
  color: #0284c7;
}

.card-body {
  padding: 20px 24px;
}

.write-recommendation-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 20px;
}

.write-recommendation-box h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.pending-moderation-box {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
}

.pending-moderation-box h4 {
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 12px 0;
}

.pending-rec-item {
  background: #ffffff;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
}

.pending-rec-item .rec-content {
  font-size: 13px;
  color: #334155;
  font-style: italic;
  margin: 0 0 6px 0;
}

.pending-rec-item .rec-meta {
  font-size: 11px;
  color: #64748b;
  display: block;
  margin-bottom: 8px;
}

.moderation-actions {
  display: flex;
  gap: 8px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-item {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 16px;
}

.recommendation-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.rec-author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.rec-body {
  flex: 1;
}

.rec-author-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.rec-quote {
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
  margin: 0 0 6px 0;
  font-style: italic;
}

.rec-date {
  font-size: 11px;
  color: #94a3b8;
}

.empty-recommendations {
  text-align: center;
  color: #64748b;
  padding: 20px 0;
  font-size: 13px;
}
</style>
