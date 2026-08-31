<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Eventos Profissionais & Webinars</h1>
        <p>Participe de meetups, conferências técnicas, painéis de carreira e workshops do ecossistema Workix</p>
      </div>
    </div>

    <div class="container section-padding">
      <!-- Search, Filters and Create Action Bar -->
      <div class="events-actions-bar d-flex justify-content-between align-items-center flex-wrap gap-16">
        <div class="search-box">
          <i class="fa fa-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar eventos por tema, palestrante ou tecnologia..."
            class="form-control"
          />
        </div>

        <div class="filter-pills d-flex gap-8">
          <button
            type="button"
            class="btn btn-sm"
            :class="selectedType === 'ALL' ? 'btn-primary' : 'btn-outline-default'"
            @click="selectedType = 'ALL'"
          >
            Todos
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="selectedType === 'ONLINE' ? 'btn-primary' : 'btn-outline-default'"
            @click="selectedType = 'ONLINE'"
          >
            <i class="fa fa-video-camera"></i> Online
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="selectedType === 'IN_PERSON' ? 'btn-primary' : 'btn-outline-default'"
            @click="selectedType = 'IN_PERSON'"
          >
            <i class="fa fa-map-marker"></i> Presencial
          </button>
        </div>

        <button type="button" class="btn btn-primary" @click="showCreateModal = true">
          <i class="fa fa-calendar-plus-o"></i> Criar Evento
        </button>
      </div>

      <!-- Create Event Modal -->
      <div v-if="showCreateModal" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h3><i class="fa fa-calendar-check-o"></i> Publicar Novo Evento</h3>
            <button type="button" class="btn-close" @click="showCreateModal = false">&times;</button>
          </div>

          <form @submit.prevent="handleCreateEvent" class="modal-body">
            <div v-if="createError" class="alert alert-danger">{{ createError }}</div>

            <div class="form-group">
              <label>Título do Evento *</label>
              <input
                v-model="createForm.title"
                type="text"
                class="form-control"
                placeholder="Ex: Workshop Prático de Vue 3 & TypeScript"
                required
              />
            </div>

            <div class="form-group">
              <label>Descrição e Agenda</label>
              <textarea
                v-model="createForm.description"
                class="form-control"
                rows="3"
                placeholder="Detalhes, tópicos abordados e pré-requisitos..."
              ></textarea>
            </div>

            <div class="row">
              <div class="col-md-6 form-group">
                <label>Formato do Evento</label>
                <select v-model="createForm.eventType" class="form-control">
                  <option value="ONLINE">Online (Webinar / Transmissão)</option>
                  <option value="IN_PERSON">Presencial</option>
                </select>
              </div>

              <div class="col-md-6 form-group">
                <label>Data e Horário de Início *</label>
                <input
                  v-model="createForm.startTime"
                  type="datetime-local"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>{{ createForm.eventType === 'ONLINE' ? 'Link da Transmissão (Zoom, Meet, YouTube)' : 'Endereço Completo do Local' }}</label>
              <input
                v-model="createForm.locationOrUrl"
                type="text"
                class="form-control"
                :placeholder="createForm.eventType === 'ONLINE' ? 'https://meet.google.com/...' : 'Av. Paulista, 1000 - SP'"
              />
            </div>

            <div class="modal-footer d-flex justify-content-end gap-10">
              <button type="button" class="btn btn-default" @click="showCreateModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <i class="fa" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-check'"></i>
                {{ isSubmitting ? 'Publicando...' : 'Publicar Evento' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="eventsStore.isLoading" class="loading-state">
        <i class="fa fa-spinner fa-spin"></i> Carregando calendário de eventos...
      </div>

      <!-- Events Grid -->
      <div v-else-if="filteredEvents.length > 0" class="row margin-top-24">
        <div
          v-for="ev in filteredEvents"
          :key="ev.id"
          class="col-md-4 col-sm-6 col-xs-12 margin-bottom-24"
        >
          <div class="event-card">
            <div class="event-banner">
              <span class="event-type-badge" :class="ev.eventType === 'IN_PERSON' ? 'badge-inperson' : 'badge-online'">
                <i class="fa" :class="ev.eventType === 'IN_PERSON' ? 'fa-map-marker' : 'fa-video-camera'"></i>
                {{ ev.eventType === 'IN_PERSON' ? 'Presencial' : 'Online' }}
              </span>
            </div>

            <div class="event-body">
              <div class="event-date-pill">
                <i class="fa fa-calendar"></i> {{ formatDate(ev.startTime) }}
              </div>

              <h4 class="event-title">{{ ev.title }}</h4>
              <p class="event-desc">{{ ev.description || 'Encontro profissional de tecnologia e networking.' }}</p>

              <div class="event-location" v-if="ev.locationOrUrl">
                <i class="fa" :class="ev.eventType === 'IN_PERSON' ? 'fa-building-o' : 'fa-link'"></i>
                <span>{{ ev.locationOrUrl }}</span>
              </div>

              <div class="event-footer margin-top-16">
                <router-link :to="`/events/${ev.id}`" class="btn btn-block btn-outline-primary">
                  <i class="fa fa-ticket"></i> Ver Detalhes & RSVP
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-box">
        <i class="fa fa-calendar-o"></i>
        <h3>Nenhum evento encontrado</h3>
        <p>Não há eventos agendados para os filtros selecionados.</p>
        <button type="button" class="btn btn-primary margin-top-10" @click="showCreateModal = true">
          <i class="fa fa-plus"></i> Publicar Primeiro Evento
        </button>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useEventsStore from '../stores/events';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const router = useRouter();
const eventsStore = useEventsStore();

const searchQuery = ref('');
const selectedType = ref('ALL');
const showCreateModal = ref(false);
const isSubmitting = ref(false);
const createError = ref('');

const createForm = reactive({
  title: '',
  description: '',
  eventType: 'ONLINE',
  startTime: '',
  locationOrUrl: ''
});

onMounted(async () => {
  await eventsStore.fetchEvents();
});

const filteredEvents = computed(() => {
  let list = eventsStore.eventsList;

  if (selectedType.value !== 'ALL') {
    list = list.filter((e) => e.eventType === selectedType.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (e) => e.title.toLowerCase().includes(q) || (e.description && e.description.toLowerCase().includes(q))
    );
  }

  return list;
});

async function handleCreateEvent() {
  createError.value = '';
  if (!createForm.title.trim() || !createForm.startTime) {
    createError.value = 'Preencha o título e a data de início do evento.';
    return;
  }

  isSubmitting.value = true;
  try {
    const created = await eventsStore.createEvent(
      createForm.title,
      createForm.description,
      createForm.eventType,
      createForm.startTime,
      undefined,
      createForm.locationOrUrl
    );

    showCreateModal.value = false;
    createForm.title = '';
    createForm.description = '';
    createForm.eventType = 'ONLINE';
    createForm.startTime = '';
    createForm.locationOrUrl = '';

    if (created?.id) {
      router.push(`/events/${created.id}`);
    }
  } catch (err: any) {
    createError.value = err.message || 'Erro ao publicar evento.';
  } finally {
    isSubmitting.value = false;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Em breve';
  try {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
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

.events-actions-bar {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
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

.gap-16 { gap: 16px; }
.gap-8 { gap: 8px; }
.gap-10 { gap: 10px; }
.margin-top-24 { margin-top: 24px; }
.margin-bottom-24 { margin-bottom: 24px; }
.margin-top-16 { margin-top: 16px; }
.margin-top-10 { margin-top: 10px; }

/* Event Card */
.event-card {
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

.event-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.event-banner {
  height: 60px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  padding: 12px 16px;
}

.event-type-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-online { background: rgba(14, 165, 233, 0.5); }
.badge-inperson { background: rgba(22, 163, 74, 0.6); }

.event-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.event-date-pill {
  font-size: 12px;
  font-weight: 700;
  color: #0284c7;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.event-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.4;
  flex: 1;
}

.event-location {
  font-size: 12px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-footer {
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
  max-width: 550px;
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
