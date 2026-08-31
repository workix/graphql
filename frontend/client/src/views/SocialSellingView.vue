<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Social Selling Index (SSI)</h1>
        <p>Monitore a eficácia da sua marca profissional, networking, engajamento com conteúdo e relacionamentos no Workix</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Main SSI Dashboard Column -->
        <div class="col-md-8 col-sm-12">
          <!-- Total Score Card -->
          <div class="ssi-main-card">
            <div class="card-header-bar d-flex justify-content-between align-items-center">
              <h3><i class="fa fa-tachometer"></i> Seu Índice de Vendas Sociais Atual</h3>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                :disabled="analyticsStore.isRecalculating"
                @click="analyticsStore.recalculateSSI"
              >
                <i class="fa" :class="analyticsStore.isRecalculating ? 'fa-spinner fa-spin' : 'fa-refresh'"></i>
                {{ analyticsStore.isRecalculating ? 'Recalculando...' : 'Recalcular SSI' }}
              </button>
            </div>

            <div class="card-body text-center">
              <div class="score-circle-wrapper">
                <div class="score-circle">
                  <span class="score-number">{{ analyticsStore.totalScore }}</span>
                  <span class="score-max">de 100</span>
                </div>
              </div>
              <h4 class="score-status-title">
                {{ getScoreClassification(analyticsStore.totalScore) }}
              </h4>
              <p class="score-status-desc">
                Líderes de vendas e networking no setor costumam manter um SSI acima de 70 pontos.
              </p>
            </div>
          </div>

          <!-- The 4 Pillars Breakdown Card -->
          <div class="ssi-pillars-card margin-top-24">
            <div class="card-header-bar">
              <h3><i class="fa fa-cubes"></i> Os 4 Pilares do SSI</h3>
            </div>

            <div class="card-body">
              <!-- Pillar 1 -->
              <div class="pillar-item">
                <div class="pillar-header">
                  <div class="pillar-title">
                    <span class="pillar-bullet bullet-brand">1</span>
                    <h4>Estabelecer sua marca profissional</h4>
                  </div>
                  <span class="pillar-score">{{ analyticsStore.postsScore }} / 25</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill fill-brand" :style="{ width: `${(analyticsStore.postsScore / 25) * 100}%` }"></div>
                </div>
                <p class="pillar-tip">Complete seu perfil com foco no cliente e publique posts e artigos de valor.</p>
              </div>

              <!-- Pillar 2 -->
              <div class="pillar-item">
                <div class="pillar-header">
                  <div class="pillar-title">
                    <span class="pillar-bullet bullet-people">2</span>
                    <h4>Localizar as pessoas certas</h4>
                  </div>
                  <span class="pillar-score">{{ analyticsStore.networkScore }} / 25</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill fill-people" :style="{ width: `${(analyticsStore.networkScore / 25) * 100}%` }"></div>
                </div>
                <p class="pillar-tip">Identifique melhores tomadores de decisão e expanda sua rede com conexões estratégicas.</p>
              </div>

              <!-- Pillar 3 -->
              <div class="pillar-item">
                <div class="pillar-header">
                  <div class="pillar-title">
                    <span class="pillar-bullet bullet-engage">3</span>
                    <h4>Interagir oferecendo insights</h4>
                  </div>
                  <span class="pillar-score">{{ analyticsStore.engagementScore }} / 25</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill fill-engage" :style="{ width: `${(analyticsStore.engagementScore / 25) * 100}%` }"></div>
                </div>
                <p class="pillar-tip">Descubra e compartilhe atualizações valiosas para iniciar ou manter conversas.</p>
              </div>

              <!-- Pillar 4 -->
              <div class="pillar-item">
                <div class="pillar-header">
                  <div class="pillar-title">
                    <span class="pillar-bullet bullet-relationships">4</span>
                    <h4>Criar relacionamentos de confiança</h4>
                  </div>
                  <span class="pillar-score">{{ analyticsStore.relationshipsScore }} / 25</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill fill-relationships" :style="{ width: `${(analyticsStore.relationshipsScore / 25) * 100}%` }"></div>
                </div>
                <p class="pillar-tip">Fortaleça sua rede conectando-se e construindo confiança com colegas e decisores.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Navigation Column -->
        <div class="col-md-4 col-sm-12">
          <div class="sidebar-action-card">
            <h4><i class="fa fa-line-chart"></i> Central de Analytics</h4>
            <p>Acesse outros relatórios de desempenho da sua conta profissional no Workix.</p>
            <hr />
            <router-link to="/analytics/views" class="btn btn-outline-primary btn-block">
              <i class="fa fa-eye"></i> Quem Visualizou Meu Perfil
            </router-link>
            <router-link to="/profile/edit" class="btn btn-outline-default btn-block margin-top-10">
              <i class="fa fa-pencil"></i> Aprimorar Perfil
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
  await analyticsStore.fetchSSI();
});

function getScoreClassification(score: number) {
  if (score >= 80) return 'Excelente! Você está no Top 5% da sua indústria';
  if (score >= 65) return 'Muito Bom! Sua presença e engajamento estão fortes';
  if (score >= 50) return 'Bom! Continue compartilhando insights e interagindo';
  return 'Iniciante. Fortaleça seu perfil e faça novas conexões';
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

.ssi-main-card,
.ssi-pillars-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.margin-top-24 {
  margin-top: 24px;
}

.margin-top-10 {
  margin-top: 10px;
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
  padding: 24px;
}

.score-circle-wrapper {
  display: flex;
  justify-content: center;
  margin: 16px 0 20px 0;
}

.score-circle {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: #0284c7;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);
}

.score-number {
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
}

.score-max {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.9;
}

.score-status-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.score-status-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* Pillars list */
.pillar-item {
  margin-bottom: 24px;
}

.pillar-item:last-child {
  margin-bottom: 0;
}

.pillar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.pillar-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pillar-bullet {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bullet-brand { background: #0284c7; }
.bullet-people { background: #16a34a; }
.bullet-engage { background: #d97706; }
.bullet-relationships { background: #9333ea; }

.pillar-title h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.pillar-score {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.progress-bar-bg {
  height: 10px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease;
}

.fill-brand { background: #0284c7; }
.fill-people { background: #16a34a; }
.fill-engage { background: #d97706; }
.fill-relationships { background: #9333ea; }

.pillar-tip {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.sidebar-action-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.sidebar-action-card h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.sidebar-action-card p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}
</style>
