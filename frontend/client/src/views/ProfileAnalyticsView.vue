<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Quem Visualizou Seu Perfil</h1>
        <p>Acompanhe os profissionais e recrutadores que visitaram sua página recentemente</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Main Views List Column -->
        <div class="col-md-8 col-sm-12">
          <div class="views-main-card">
            <!-- Metric Overview Header -->
            <div class="views-overview-bar">
              <div class="metric-block">
                <span class="metric-num">{{ analyticsStore.profileViews.length }}</span>
                <span class="metric-lbl">Visualizações recentes</span>
              </div>
              <div class="metric-tip">
                <i class="fa fa-line-chart"></i> Perfis completos com o selo <strong>#OpenToWork</strong> recebem até 4x mais visitas de recrutadores.
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="analyticsStore.isLoading" class="loading-state">
              <i class="fa fa-spinner fa-spin"></i> Carregando visitantes...
            </div>

            <!-- Viewers List Stream -->
            <div v-else-if="analyticsStore.profileViews.length > 0" class="viewers-list-stream">
              <div
                v-for="v in analyticsStore.profileViews"
                :key="v.id"
                class="viewer-row-item"
              >
                <div class="viewer-avatar">
                  <i class="fa fa-user"></i>
                </div>

                <div class="viewer-info">
                  <h4 class="viewer-name">Profissional #{{ v.viewerId }}</h4>
                  <p class="viewer-headline">Visualizou seu perfil no ecossistema Workix</p>
                  <span class="viewer-time">{{ formatDate(v.viewedAt) }}</span>
                </div>

                <div class="viewer-actions">
                  <router-link :to="`/in/${v.viewerId}`" class="btn btn-sm btn-outline-primary">
                    <i class="fa fa-external-link"></i> Ver Perfil
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-views-box">
              <i class="fa fa-eye-slash"></i>
              <h4>Nenhuma visualização recente encontrada</h4>
              <p>Compartilhe artigos no feed ou conecte-se com novos profissionais para aumentar o alcance do seu perfil.</p>
              <router-link to="/feed" class="btn btn-primary btn-sm margin-top-10">
                <i class="fa fa-newspaper-o"></i> Ir para o Feed
              </router-link>
            </div>
          </div>
        </div>

        <!-- Sidebar Navigation Column -->
        <div class="col-md-4 col-sm-12">
          <div class="sidebar-info-card">
            <h4><i class="fa fa-bullseye"></i> Dicas para Atrair Visitas</h4>
            <ul class="tips-list">
              <li>Mantenha sua Headline profissional clara e com palavras-chave da sua área.</li>
              <li>Adicione projetos e certificados na sua seção de Destaques.</li>
              <li>Publique ou comente em postagens relevantes pelo menos 2x por semana.</li>
            </ul>
            <hr />
            <router-link to="/analytics/ssi" class="btn btn-outline-primary btn-block">
              <i class="fa fa-tachometer"></i> Ver Índice SSI
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useAnalyticsStore from '../stores/analytics';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const analyticsStore = useAnalyticsStore();

onMounted(async () => {
  await analyticsStore.fetchProfileViews();
});

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Hoje';
  try {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
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

.views-main-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.views-overview-bar {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.metric-block {
  display: flex;
  flex-direction: column;
}

.metric-num {
  font-size: 28px;
  font-weight: 800;
  color: #0284c7;
  line-height: 1;
}

.metric-lbl {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.metric-tip {
  font-size: 12px;
  color: #475569;
  max-width: 400px;
  line-height: 1.4;
}

.viewers-list-stream {
  display: flex;
  flex-direction: column;
}

.viewer-row-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f8fafc;
  gap: 16px;
  transition: background 0.2s ease;
}

.viewer-row-item:hover {
  background: #f8fafc;
}

.viewer-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.viewer-info {
  flex: 1;
}

.viewer-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.viewer-headline {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 4px 0;
}

.viewer-time {
  font-size: 11px;
  color: #94a3b8;
}

.empty-views-box,
.loading-state {
  text-align: center;
  padding: 50px 20px;
  color: #64748b;
}

.empty-views-box i {
  font-size: 44px;
  color: #cbd5e1;
  margin-bottom: 12px;
}

.empty-views-box h4 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.sidebar-info-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.sidebar-info-card h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px 0;
}

.tips-list {
  padding-left: 18px;
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

.margin-top-10 {
  margin-top: 10px;
}
</style>
