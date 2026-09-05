<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Agenda de Entrevistas</h1>
        <p>Acompanhe seus agendamentos, confirme presenças e gerencie suas reuniões de seleção</p>
      </div>
    </div>

    <div class="container section-padding">
      <!-- Top Action Bar -->
      <div class="schedule-top-bar">
        <div class="tabs-status-nav">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'UPCOMING' }"
            @click="activeTab = 'UPCOMING'"
          >
            <i class="fa fa-calendar-check-o"></i> Próximas ({{ upcomingCount }})
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'PENDING' }"
            @click="activeTab = 'PENDING'"
          >
            <i class="fa fa-clock-o"></i> Pendentes de Resposta ({{ pendingCount }})
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'COMPLETED' }"
            @click="activeTab = 'COMPLETED'"
          >
            <i class="fa fa-check-circle"></i> Concluídas
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'CANCELLED' }"
            @click="activeTab = 'CANCELLED'"
          >
            <i class="fa fa-ban"></i> Canceladas
          </button>
        </div>

        <button type="button" class="btn-new-interview" @click="showScheduleModal = true">
          <i class="fa fa-plus"></i> Agendar Nova Entrevista
        </button>
      </div>

      <LoadingOverlay :loading="loading" />

      <!-- Empty State -->
      <div v-if="!loading && filteredInterviews.length === 0" class="empty-schedule-box text-center">
        <i class="fa fa-calendar-o empty-icon"></i>
        <h3>Nenhuma entrevista nesta visualização</h3>
        <p>Você não possui reuniões agendadas ou pendentes com este status no momento.</p>
      </div>

      <!-- Interviews List -->
      <div v-else class="interviews-list-container">
        <div
          v-for="item in filteredInterviews"
          :key="item.id"
          class="interview-card"
          :class="`status-${item.status.toLowerCase()}`"
        >
          <div class="interview-card-main">
            <!-- Format Icon -->
            <div class="format-badge-box" :class="item.format.toLowerCase()">
              <i v-if="item.format === 'ONLINE'" class="fa fa-video-camera"></i>
              <i v-else-if="item.format === 'IN_PERSON'" class="fa fa-map-marker"></i>
              <i v-else class="fa fa-phone"></i>
            </div>

            <!-- Details -->
            <div class="interview-details">
              <div class="interview-title-row">
                <h4 class="interview-title">{{ item.title }}</h4>
                <span class="status-badge" :class="item.status.toLowerCase()">
                  {{ formatStatus(item.status) }}
                </span>
              </div>

              <div class="interview-meta-row">
                <span class="meta-item">
                  <i class="fa fa-clock-o"></i>
                  <strong>{{ formatDateTime(item.scheduledAt) }}</strong> ({{ item.durationMinutes }} min)
                </span>
                <span v-if="item.job" class="meta-item">
                  <i class="fa fa-briefcase"></i> {{ item.job.title }}
                </span>
                <span v-if="item.candidate" class="meta-item">
                  <i class="fa fa-user"></i> {{ item.candidate.name }}
                </span>
                <span v-if="item.company" class="meta-item">
                  <i class="fa fa-building-o"></i> {{ item.company.name }}
                </span>
              </div>

              <!-- Location / Link -->
              <div v-if="item.meetingLink" class="meeting-link-box">
                <i class="fa fa-link"></i>
                <a :href="item.meetingLink" target="_blank" rel="noopener noreferrer">
                  Entrar na Chamada Online ({{ item.meetingLink }})
                </a>
              </div>
              <div v-else-if="item.locationAddress" class="location-box">
                <i class="fa fa-map-pin"></i> {{ item.locationAddress }}
              </div>

              <!-- Reschedule Reason or Feedback -->
              <div v-if="item.rescheduleReason" class="reschedule-alert">
                <i class="fa fa-info-circle"></i> <strong>Solicitação de Reagendamento:</strong> {{ item.rescheduleReason }}
              </div>
            </div>
          </div>

          <!-- Actions Area -->
          <div class="interview-card-actions">
            <template v-if="item.status === 'SCHEDULED' || item.status === 'RESCHEDULE_REQUESTED'">
              <button
                type="button"
                class="btn-action-confirm"
                @click="openResponseModal(item, 'CONFIRMED')"
              >
                <i class="fa fa-check"></i> Confirmar
              </button>
              <button
                type="button"
                class="btn-action-reschedule"
                @click="openResponseModal(item, 'RESCHEDULE_REQUESTED')"
              >
                <i class="fa fa-clock-o"></i> Reagendar
              </button>
              <button
                type="button"
                class="btn-action-reject"
                @click="openResponseModal(item, 'REJECTED')"
              >
                <i class="fa fa-times"></i> Recusar
              </button>
            </template>
            <button
              v-if="item.status !== 'CANCELLED' && item.status !== 'COMPLETED'"
              type="button"
              class="btn-action-cancel"
              @click="handleCancel(item.id)"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Resposta do Candidato -->
    <div v-if="showResponseModal" class="modal-backdrop">
      <div class="modal-dialog-custom">
        <div class="modal-header-custom">
          <h4><i class="fa fa-reply"></i> Responder Convite de Entrevista</h4>
          <button type="button" class="btn-close" @click="showResponseModal = false">&times;</button>
        </div>
        <div class="modal-body-custom">
          <p><strong>Entrevista:</strong> {{ selectedInterview?.title }}</p>
          <div class="form-group">
            <label>Ação Selecionada</label>
            <select v-model="responseAction" class="form-control">
              <option value="CONFIRMED">Confirmar Presença</option>
              <option value="RESCHEDULE_REQUESTED">Solicitar Reagendamento</option>
              <option value="REJECTED">Recusar Entrevista</option>
            </select>
          </div>
          <div v-if="responseAction === 'RESCHEDULE_REQUESTED'" class="form-group">
            <label>Justificativa / Melhores Horários *</label>
            <textarea
              v-model="responseReason"
              class="form-control"
              rows="3"
              placeholder="Descreva o motivo e informe suas disponibilidades alternativas..."
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label>Comentários / Mensagem adicional (opcional)</label>
            <input
              type="text"
              v-model="responseFeedback"
              class="form-control"
              placeholder="Ex: Muito obrigado pela oportunidade!"
            />
          </div>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn btn-default" @click="showResponseModal = false">Fechar</button>
          <button type="button" class="btn btn-primary" :disabled="submitting" @click="submitResponse">
            {{ submitting ? 'Enviando...' : 'Confirmar Resposta' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Agendamento de Nova Entrevista (Empresa) -->
    <div v-if="showScheduleModal" class="modal-backdrop">
      <div class="modal-dialog-custom">
        <div class="modal-header-custom">
          <h4><i class="fa fa-calendar-plus-o"></i> Agendar Nova Entrevista</h4>
          <button type="button" class="btn-close" @click="showScheduleModal = false">&times;</button>
        </div>
        <div class="modal-body-custom">
          <form @submit.prevent="submitCreateInterview">
            <div class="form-group">
              <label>Título da Entrevista *</label>
              <input
                type="text"
                v-model="newInterview.title"
                class="form-control"
                placeholder="Ex: Entrevista Técnica — Vue 3 & Node.js"
                required
              />
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>ID do Candidato *</label>
                  <input
                    type="number"
                    v-model="newInterview.candidateId"
                    class="form-control"
                    placeholder="ID do candidato"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>ID da Vaga (opcional)</label>
                  <input
                    type="number"
                    v-model="newInterview.jobId"
                    class="form-control"
                    placeholder="ID da vaga"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Data e Horário *</label>
                  <input
                    type="datetime-local"
                    v-model="newInterview.scheduledAt"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Formato *</label>
                  <select v-model="newInterview.format" class="form-control" required>
                    <option value="ONLINE">Online (Videoconferência)</option>
                    <option value="IN_PERSON">Presencial</option>
                    <option value="PHONE">Telefone</option>
                  </select>
                </div>
              </div>
            </div>
            <div v-if="newInterview.format === 'ONLINE'" class="form-group">
              <label>Link da Reunião (Google Meet, Zoom, Teams)</label>
              <input
                type="url"
                v-model="newInterview.meetingLink"
                class="form-control"
                placeholder="https://meet.google.com/xyz-abcd-jkl"
              />
            </div>
            <div v-if="newInterview.format === 'IN_PERSON'" class="form-group">
              <label>Endereço Completo</label>
              <input
                type="text"
                v-model="newInterview.locationAddress"
                class="form-control"
                placeholder="Av. Paulista, 1000 - Bela Vista, São Paulo, SP"
              />
            </div>
            <div class="modal-footer-custom px-0 pb-0">
              <button type="button" class="btn btn-default" @click="showScheduleModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Agendando...' : 'Enviar Convite' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import { interviewsService, InterviewModel } from '../services/interviews';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const loading = ref(false);
const submitting = ref(false);
const interviews = ref<InterviewModel[]>([]);
const activeTab = ref<'UPCOMING' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

const showResponseModal = ref(false);
const showScheduleModal = ref(false);
const selectedInterview = ref<InterviewModel | null>(null);
const responseAction = ref<'CONFIRMED' | 'RESCHEDULE_REQUESTED' | 'REJECTED'>('CONFIRMED');
const responseReason = ref('');
const responseFeedback = ref('');

const newInterview = reactive({
  title: '',
  candidateId: '',
  jobId: '',
  scheduledAt: '',
  durationMinutes: 45,
  format: 'ONLINE',
  meetingLink: '',
  locationAddress: '',
});

const upcomingCount = computed(() => {
  return interviews.value.filter(i => i.status === 'CONFIRMED' || i.status === 'SCHEDULED').length;
});

const pendingCount = computed(() => {
  return interviews.value.filter(i => i.status === 'SCHEDULED' || i.status === 'RESCHEDULE_REQUESTED').length;
});

const filteredInterviews = computed(() => {
  if (activeTab.value === 'UPCOMING') {
    return interviews.value.filter(i => i.status === 'CONFIRMED' || i.status === 'SCHEDULED');
  }
  if (activeTab.value === 'PENDING') {
    return interviews.value.filter(i => i.status === 'SCHEDULED' || i.status === 'RESCHEDULE_REQUESTED');
  }
  if (activeTab.value === 'COMPLETED') {
    return interviews.value.filter(i => i.status === 'COMPLETED');
  }
  if (activeTab.value === 'CANCELLED') {
    return interviews.value.filter(i => i.status === 'CANCELLED');
  }
  return interviews.value;
});

function formatStatus(status: string) {
  const map: Record<string, string> = {
    SCHEDULED: 'Aguardando Resposta',
    CONFIRMED: 'Confirmada',
    REJECTED: 'Recusada',
    RESCHEDULE_REQUESTED: 'Reagendamento Solicitado',
    COMPLETED: 'Concluída',
    CANCELLED: 'Cancelada',
  };
  return map[status] || status;
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function openResponseModal(item: InterviewModel, defaultAction: 'CONFIRMED' | 'RESCHEDULE_REQUESTED' | 'REJECTED') {
  selectedInterview.value = item;
  responseAction.value = defaultAction;
  responseReason.value = '';
  responseFeedback.value = '';
  showResponseModal.value = true;
}

async function submitResponse() {
  if (!selectedInterview.value) return;
  submitting.value = true;
  try {
    await interviewsService.respond(selectedInterview.value.id, {
      status: responseAction.value,
      rescheduleReason: responseReason.value,
      candidateFeedback: responseFeedback.value,
    });
    showResponseModal.value = false;
    await fetchInterviews();
  } catch (err: any) {
    alert(err.message || 'Falha ao enviar resposta de entrevista.');
  } finally {
    submitting.value = false;
  }
}

async function handleCancel(id: string | number) {
  if (!confirm('Deseja realmente cancelar esta entrevista?')) return;
  try {
    await interviewsService.cancel(id, 'Cancelada pelo usuário');
    await fetchInterviews();
  } catch (err: any) {
    alert(err.message || 'Falha ao cancelar entrevista.');
  }
}

async function submitCreateInterview() {
  submitting.value = true;
  try {
    const companyId = authStore.user?.companyId || authStore.user?.id || 1;
    await interviewsService.create({
      companyId: Number(companyId),
      candidateId: Number(newInterview.candidateId),
      jobId: newInterview.jobId ? Number(newInterview.jobId) : null,
      title: newInterview.title,
      scheduledAt: newInterview.scheduledAt,
      durationMinutes: Number(newInterview.durationMinutes),
      format: newInterview.format,
      meetingLink: newInterview.meetingLink || null,
      locationAddress: newInterview.locationAddress || null,
    });
    showScheduleModal.value = false;
    await fetchInterviews();
  } catch (err: any) {
    alert(err.message || 'Erro ao criar agendamento.');
  } finally {
    submitting.value = false;
  }
}

async function fetchInterviews() {
  loading.value = true;
  try {
    const companyId = authStore.user?.companyId || 1;
    const res = await interviewsService.listByCompany(companyId);
    interviews.value = res.data || [];
  } catch (err) {
    console.error('Erro ao buscar entrevistas:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchInterviews();
});
</script>

<style scoped>
.page-header {
  background: #0f172a;
  color: #ffffff;
  padding: 45px 0;
}

.schedule-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.tabs-status-nav {
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
  flex-wrap: wrap;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.btn-new-interview {
  background: #0284c7;
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-new-interview:hover {
  background: #0369a1;
  transform: translateY(-1px);
}

.empty-schedule-box {
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  color: #94a3b8;
  margin-bottom: 14px;
}

.interview-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 22px 26px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.interview-card-main {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
}

.format-badge-box {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.format-badge-box.online {
  background: #e0f2fe;
  color: #0284c7;
}

.format-badge-box.in_person {
  background: #ecfdf5;
  color: #059669;
}

.format-badge-box.phone {
  background: #fef3c7;
  color: #d97706;
}

.interview-details {
  flex: 1;
}

.interview-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.interview-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.status-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.status-badge.scheduled {
  background: #eff6ff;
  color: #2563eb;
}

.status-badge.confirmed {
  background: #ecfdf5;
  color: #059669;
}

.status-badge.reschedule_requested {
  background: #fffbeb;
  color: #d97706;
}

.status-badge.completed {
  background: #f1f5f9;
  color: #475569;
}

.status-badge.cancelled {
  background: #fef2f2;
  color: #dc2626;
}

.interview-meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.meeting-link-box a {
  color: #0284c7;
  font-weight: 600;
  font-size: 13px;
  text-decoration: underline;
}

.reschedule-alert {
  margin-top: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  color: #92400e;
}

.interview-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-action-confirm {
  background: #10b981;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-action-reschedule {
  background: #f59e0b;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-action-reject, .btn-action-cancel {
  background: #ef4444;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
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
  max-width: 520px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
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
</style>
