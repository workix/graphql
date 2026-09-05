<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="kanban-page-header">
      <div class="container-fluid px-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 class="page-title"><i class="fa fa-trello"></i> Quadro de Triagem e Recrutamento</h1>
            <p class="page-subtitle">Gerencie o pipeline de candidatos com triagem visual e histórico auditável</p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-outline-light btn-sm" @click="showAddStageModal = true">
              <i class="fa fa-plus"></i> Nova Etapa
            </button>
            <router-link to="/my-jobs" class="btn btn-light btn-sm">
              <i class="fa fa-briefcase"></i> Minhas Vagas
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="kanban-board-wrapper">
      <LoadingOverlay :loading="loading" />

      <div v-if="!loading" class="kanban-board-scroll">
        <div
          v-for="stage in board?.stages || []"
          :key="stage.id"
          class="kanban-column"
          @dragover.prevent
          @drop="handleDrop($event, stage.id)"
        >
          <!-- Stage Header -->
          <div class="column-header" :style="{ borderTopColor: stage.color || '#3b82f6' }">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="column-title">
                <span class="stage-color-dot" :style="{ background: stage.color || '#3b82f6' }"></span>
                {{ stage.name }}
              </h4>
              <span class="cards-count">{{ stage.cards?.length || 0 }}</span>
            </div>
          </div>

          <!-- Stage Cards Container -->
          <div class="cards-list">
            <div
              v-for="card in stage.cards || []"
              :key="card.id"
              class="candidate-kanban-card"
              draggable="true"
              @dragstart="handleDragStart($event, card)"
              @click="openCardDetail(card)"
            >
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="candidate-card-name">
                  {{ card.candidate?.name || `Candidato #${card.candidateId}` }}
                </h5>
                <div v-if="card.rating" class="rating-stars">
                  <i v-for="star in card.rating" :key="star" class="fa fa-star text-warning"></i>
                </div>
              </div>

              <div class="card-meta-text">
                <span class="text-muted"><i class="fa fa-clock-o"></i> {{ formatDate(card.createdAt) }}</span>
              </div>

              <p v-if="card.notes" class="card-notes-preview">
                <i class="fa fa-sticky-note-o"></i> {{ card.notes }}
              </p>

              <div v-if="card.tags && card.tags.length > 0" class="card-tags-list">
                <span v-for="tag in card.tags" :key="tag" class="tag-badge">{{ tag }}</span>
              </div>
            </div>

            <!-- Empty Drop Target Area -->
            <div v-if="!stage.cards || stage.cards.length === 0" class="empty-column-placeholder">
              <span>Arraste candidatos para cá</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalhes do Card e Histórico -->
    <div v-if="showDetailModal" class="modal-backdrop">
      <div class="modal-dialog-custom modal-lg">
        <div class="modal-header-custom">
          <h4><i class="fa fa-user"></i> Detalhes da Triagem — {{ selectedCard?.candidate?.name || 'Candidato' }}</h4>
          <button type="button" class="btn-close" @click="showDetailModal = false">&times;</button>
        </div>
        <div class="modal-body-custom">
          <div class="row">
            <div class="col-md-7">
              <div class="form-group mb-3">
                <label>Avaliação do Recrutador (1 a 5 estrelas)</label>
                <div class="rating-picker d-flex gap-2">
                  <button
                    v-for="r in 5"
                    :key="r"
                    type="button"
                    class="btn btn-sm"
                    :class="(cardEditRating >= r) ? 'btn-warning' : 'btn-outline-secondary'"
                    @click="cardEditRating = r"
                  >
                    ★ {{ r }}
                  </button>
                </div>
              </div>

              <div class="form-group mb-3">
                <label>Notas e Parecer da Triagem</label>
                <textarea
                  v-model="cardEditNotes"
                  class="form-control"
                  rows="4"
                  placeholder="Registre impressões sobre o perfil, aderência aos requisitos ou feedbacks de entrevista..."
                ></textarea>
              </div>

              <button
                type="button"
                class="btn btn-primary btn-sm"
                :disabled="savingCard"
                @click="saveCardChanges"
              >
                {{ savingCard ? 'Salvando...' : 'Salvar Avaliação' }}
              </button>
            </div>

            <div class="col-md-5">
              <h5 class="history-heading"><i class="fa fa-history"></i> Histórico de Movimentações</h5>
              <div class="history-timeline">
                <div
                  v-for="h in selectedCard?.histories || []"
                  :key="h.id"
                  class="history-entry"
                >
                  <div class="history-time">{{ formatDate(h.createdAt) }}</div>
                  <div class="history-text">
                    {{ h.notes || 'Movimentado de etapa no pipeline' }}
                  </div>
                </div>
                <div v-if="!selectedCard?.histories || selectedCard.histories.length === 0" class="text-muted small">
                  Sem movimentações adicionais registradas.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn btn-default" @click="showDetailModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- Modal Nova Etapa -->
    <div v-if="showAddStageModal" class="modal-backdrop">
      <div class="modal-dialog-custom">
        <div class="modal-header-custom">
          <h4><i class="fa fa-columns"></i> Adicionar Nova Etapa</h4>
          <button type="button" class="btn-close" @click="showAddStageModal = false">&times;</button>
        </div>
        <div class="modal-body-custom">
          <div class="form-group mb-3">
            <label>Nome da Etapa *</label>
            <input
              type="text"
              v-model="newStageName"
              class="form-control"
              placeholder="Ex: Desafio Prático, Painel com Gestor"
              required
            />
          </div>
          <div class="form-group mb-3">
            <label>Cor Identificadora</label>
            <input type="color" v-model="newStageColor" class="form-control form-control-color" />
          </div>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn btn-default" @click="showAddStageModal = false">Cancelar</button>
          <button type="button" class="btn btn-primary" :disabled="savingStage" @click="submitAddStage">
            {{ savingStage ? 'Criando...' : 'Criar Etapa' }}
          </button>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { kanbanService, KanbanBoardModel, KanbanCardModel } from '../services/kanban';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const loading = ref(false);
const board = ref<KanbanBoardModel | null>(null);

const draggedCard = ref<KanbanCardModel | null>(null);

const showDetailModal = ref(false);
const selectedCard = ref<KanbanCardModel | null>(null);
const cardEditRating = ref<number>(0);
const cardEditNotes = ref<string>('');
const savingCard = ref(false);

const showAddStageModal = ref(false);
const newStageName = ref('');
const newStageColor = ref('#3b82f6');
const savingStage = ref(false);

function handleDragStart(event: DragEvent, card: KanbanCardModel) {
  draggedCard.value = card;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(card.id));
  }
}

async function handleDrop(event: DragEvent, targetStageId: string | number) {
  event.preventDefault();
  if (!draggedCard.value) return;

  const card = draggedCard.value;
  if (card.stageId === targetStageId) return;

  // Atualização otimista na interface
  const previousStageId = card.stageId;
  card.stageId = targetStageId;

  // Reposiciona no array local
  for (const stage of board.value?.stages || []) {
    stage.cards = stage.cards.filter(c => c.id !== card.id);
    if (stage.id === targetStageId) {
      stage.cards.push(card);
    }
  }

  try {
    await kanbanService.moveCard({
      cardId: card.id,
      targetStageId,
      notes: 'Movido via quadro Kanban',
    });
  } catch (err: any) {
    // Reverte em caso de falha
    card.stageId = previousStageId;
    alert(err.message || 'Falha ao sincronizar movimentação.');
    await fetchBoard();
  } finally {
    draggedCard.value = null;
  }
}

function openCardDetail(card: KanbanCardModel) {
  selectedCard.value = card;
  cardEditRating.value = card.rating || 0;
  cardEditNotes.value = card.notes || '';
  showDetailModal.value = true;
}

async function saveCardChanges() {
  if (!selectedCard.value) return;
  savingCard.value = true;
  try {
    await kanbanService.updateCard(selectedCard.value.id, {
      rating: cardEditRating.value,
      notes: cardEditNotes.value,
    });
    selectedCard.value.rating = cardEditRating.value;
    selectedCard.value.notes = cardEditNotes.value;
    showDetailModal.value = false;
  } catch (err: any) {
    alert(err.message || 'Falha ao atualizar card.');
  } finally {
    savingCard.value = false;
  }
}

async function submitAddStage() {
  if (!newStageName.value.trim()) return;
  savingStage.value = true;
  try {
    const companyId = authStore.user?.companyId || 1;
    const jobId = route.params.jobId ? String(route.params.jobId) : null;
    await kanbanService.createStage({
      companyId,
      jobId,
      name: newStageName.value.trim(),
      color: newStageColor.value,
    });
    showAddStageModal.value = false;
    newStageName.value = '';
    await fetchBoard();
  } catch (err: any) {
    alert(err.message || 'Falha ao criar etapa.');
  } finally {
    savingStage.value = false;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function fetchBoard() {
  loading.value = true;
  try {
    const companyId = authStore.user?.companyId || 1;
    const jobId = route.params.jobId ? String(route.params.jobId) : 1;
    const res = await kanbanService.getBoard(jobId, companyId);
    board.value = res.data;
  } catch (err) {
    console.error('Erro ao carregar quadro Kanban:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchBoard();
});
</script>

<style scoped>
.kanban-page-header {
  background: #0f172a;
  color: #ffffff;
  padding: 30px 0;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.kanban-board-wrapper {
  background: #f1f5f9;
  min-height: calc(100vh - 250px);
  padding: 24px;
  overflow-x: auto;
}

.kanban-board-scroll {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  min-width: 1000px;
}

.kanban-column {
  background: #ffffff;
  border-radius: 12px;
  width: 290px;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 280px);
}

.column-header {
  padding: 14px 16px;
  border-top: 4px solid #3b82f6;
  border-bottom: 1px solid #f1f5f9;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.column-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stage-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.cards-count {
  background: #f1f5f9;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

.cards-list {
  padding: 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 150px;
}

.candidate-kanban-card {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 14px;
  cursor: grab;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
}

.candidate-kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #0284c7;
}

.candidate-card-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.card-meta-text {
  font-size: 12px;
  margin-bottom: 6px;
}

.card-notes-preview {
  font-size: 12px;
  color: #475569;
  background: #f8fafc;
  padding: 6px 8px;
  border-radius: 6px;
  margin: 6px 0 0 0;
}

.empty-column-placeholder {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-dialog-custom {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-dialog-custom.modal-lg {
  max-width: 780px;
}

.modal-header-custom {
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header-custom h4 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body-custom {
  padding: 20px;
}

.modal-footer-custom {
  padding: 14px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.history-heading {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 240px;
  overflow-y: auto;
}

.history-entry {
  background: #f8fafc;
  border-left: 3px solid #0284c7;
  padding: 8px 12px;
  border-radius: 4px;
}

.history-time {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.history-text {
  font-size: 12px;
  color: #334155;
}
</style>
