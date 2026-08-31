<template>
  <div class="page-wrapper">
    <TheHeader />

    <div v-if="eventsStore.isLoading" class="loading-container text-center section-padding">
      <i class="fa fa-spinner fa-spin"></i> Carregando detalhes do evento...
    </div>

    <div v-else-if="eventsStore.activeEvent" class="event-detail-page">
      <!-- Event Header Banner -->
      <div class="event-header-banner">
        <div class="container">
          <div class="event-banner-content">
            <div class="event-type-pill" :class="eventsStore.activeEvent.eventType === 'IN_PERSON' ? 'pill-inperson' : 'pill-online'">
              <i class="fa" :class="eventsStore.activeEvent.eventType === 'IN_PERSON' ? 'fa-map-marker' : 'fa-video-camera'"></i>
              {{ eventsStore.activeEvent.eventType === 'IN_PERSON' ? 'Evento Presencial' : 'Webinar / Online' }}
            </div>

            <h1 class="event-main-title">{{ eventsStore.activeEvent.title }}</h1>

            <div class="event-meta-row d-flex flex-wrap gap-20 align-items-center">
              <div class="meta-item">
                <i class="fa fa-calendar"></i>
                <span>{{ formatDate(eventsStore.activeEvent.startTime) }}</span>
              </div>

              <div class="meta-item" v-if="eventsStore.activeEvent.locationOrUrl">
                <i class="fa" :class="eventsStore.activeEvent.eventType === 'IN_PERSON' ? 'fa-building-o' : 'fa-link'"></i>
                <a
                  v-if="eventsStore.activeEvent.eventType === 'ONLINE'"
                  :href="eventsStore.activeEvent.locationOrUrl"
                  target="_blank"
                  class="link-transmissao"
                >
                  Acessar Transmissão
                </a>
                <span v-else>{{ eventsStore.activeEvent.locationOrUrl }}</span>
              </div>
            </div>

            <!-- RSVP Button -->
            <div class="event-rsvp-cta margin-top-20">
              <button
                v-if="!eventsStore.hasConfirmedRSVP"
                type="button"
                class="btn btn-primary btn-lg"
                :disabled="isRsvping"
                @click="handleRSVP"
              >
                <i class="fa" :class="isRsvping ? 'fa-spinner fa-spin' : 'fa-check-circle'"></i>
                {{ isRsvping ? 'Confirmando...' : 'Confirmar Presença (RSVP)' }}
              </button>
              <div v-else class="badge-confirmed-pill">
                <i class="fa fa-check-circle"></i> Sua presença está confirmada neste evento!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container section-padding">
        <div class="row">
          <!-- Main Content Column -->
          <div class="col-md-8 col-sm-12">
            <!-- Event Description Card -->
            <div class="detail-card">
              <div class="card-header-bar">
                <h3><i class="fa fa-info-circle"></i> Sobre o Evento & Agenda</h3>
              </div>
              <div class="card-body">
                <p class="description-text">
                  {{ eventsStore.activeEvent.description || 'Este evento oferece aos participantes uma oportunidade ímpar de atualização técnica, debate e networking qualificado com profissionais de todo o Brasil.' }}
                </p>
              </div>
            </div>

            <!-- Attendees Section -->
            <div class="detail-card margin-top-24">
              <div class="card-header-bar d-flex justify-content-between align-items-center">
                <h3>
                  <i class="fa fa-users"></i> Participantes Confirmados
                  <span class="attendees-count-badge">{{ eventsStore.activeAttendees.length }}</span>
                </h3>
              </div>
              <div class="card-body">
                <div v-if="eventsStore.activeAttendees.length > 0" class="attendees-grid">
                  <div
                    v-for="att in eventsStore.activeAttendees"
                    :key="att.id"
                    class="attendee-card"
                  >
                    <div class="attendee-avatar">
                      <i class="fa fa-user"></i>
                    </div>
                    <div class="attendee-info">
                      <h5>Profissional #{{ att.userId }}</h5>
                      <span class="attendee-status">Presença Confirmada</span>
                    </div>
                  </div>
                </div>

                <div v-else class="empty-attendees-box">
                  <p>Ainda não há participantes confirmados. Seja o primeiro a confirmar seu RSVP!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Column -->
          <div class="col-md-4 col-sm-12">
            <div class="sidebar-card">
              <h4><i class="fa fa-shield"></i> Informações do Organizador</h4>
              <p>Evento oficial organizado por <strong>Membro #{{ eventsStore.activeEvent.organizerId }}</strong> no ecossistema Workix.</p>
              <hr />
              <router-link to="/events" class="btn btn-outline-default btn-block">
                <i class="fa fa-arrow-left"></i> Voltar ao Calendário
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="container section-padding text-center">
      <div class="empty-attendees-box">
        <i class="fa fa-calendar-times-o"></i>
        <h3>Evento não encontrado</h3>
        <p>O evento solicitado não está disponível ou foi encerrado.</p>
        <router-link to="/events" class="btn btn-primary margin-top-10">Voltar aos Eventos</router-link>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useEventsStore from '../stores/events';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const route = useRoute();
const eventsStore = useEventsStore();

const isRsvping = ref(false);

onMounted(async () => {
  const eventId = route.params.id as string;
  await eventsStore.fetchEventDetails(eventId);
});

async function handleRSVP() {
  if (!eventsStore.activeEvent) return;
  isRsvping.value = true;
  try {
    await eventsStore.rsvpEvent(eventsStore.activeEvent.id);
  } catch (err: any) {
    console.error(err);
  } finally {
    isRsvping.value = false;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Data a definir';
  try {
    return new Date(dateStr).toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
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

.event-header-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 40px 0;
  margin-bottom: 24px;
}

.event-type-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
}

.pill-online { background: #0284c7; }
.pill-inperson { background: #16a34a; }

.event-main-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.event-meta-row {
  font-size: 14px;
  color: #cbd5e1;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.link-transmissao {
  color: #38bdf8;
  text-decoration: underline;
  font-weight: 600;
}

.badge-confirmed-pill {
  background: #16a34a;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.section-padding {
  padding-bottom: 60px;
}

.gap-20 { gap: 20px; }
.margin-top-20 { margin-top: 20px; }
.margin-top-24 { margin-top: 24px; }
.margin-top-10 { margin-top: 10px; }

.detail-card,
.sidebar-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card-header-bar {
  padding: 16px 20px;
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

.attendees-count-badge {
  background: #e2e8f0;
  color: #0f172a;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.card-body {
  padding: 24px;
}

.description-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  white-space: pre-line;
}

.attendees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.attendee-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.attendee-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0284c7;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.attendee-info h5 {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.attendee-status {
  font-size: 11px;
  color: #16a34a;
  font-weight: 600;
}

.sidebar-card {
  padding: 20px;
}

.sidebar-card h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.sidebar-card p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.empty-attendees-box,
.loading-container {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}
</style>
