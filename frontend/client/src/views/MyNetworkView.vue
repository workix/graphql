<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Minha Rede Profissional</h1>
        <p>Gerencie suas conexões, responda a convites e expanda sua rede de contatos</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Left Sidebar: Network Management Summary -->
        <div class="col-md-3 col-sm-4">
          <div class="network-summary-card">
            <div class="card-header-bar">
              <h4>Gerenciar Minha Rede</h4>
            </div>
            <ul class="summary-menu-list">
              <li class="active">
                <a href="javascript:void(0)" @click="activeTab = 'all'">
                  <span><i class="fa fa-users"></i> Conexões</span>
                  <span class="badge-count">{{ connectionsStore.connectionsCount }}</span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" @click="activeTab = 'pending'">
                  <span><i class="fa fa-user-plus"></i> Convites Recebidos</span>
                  <span class="badge-count" v-if="connectionsStore.pendingRequestsCount > 0">{{ connectionsStore.pendingRequestsCount }}</span>
                  <span class="badge-count text-muted" v-else>0</span>
                </a>
              </li>
              <li>
                <router-link to="/candidates">
                  <span><i class="fa fa-search"></i> Buscar Profissionais</span>
                </router-link>
              </li>
              <li>
                <router-link to="/feed">
                  <span><i class="fa fa-newspaper-o"></i> Feed da Comunidade</span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="network-tip-box">
            <h4><i class="fa fa-lightbulb-o"></i> Dica de Conexão</h4>
            <p>Conectar-se com profissionais da sua área aumenta suas chances de receber oportunidades diretas em até 4x.</p>
          </div>
        </div>

        <!-- Center Main Content -->
        <div class="col-md-9 col-sm-8">
          <!-- Pending Invitations Section (if any) -->
          <div v-if="connectionsStore.pendingRequests.length > 0" class="network-section-card mb-4">
            <div class="section-title-wrap">
              <h3><i class="fa fa-envelope-open-o"></i> Convites de Conexão Pendentes ({{ connectionsStore.pendingRequests.length }})</h3>
            </div>
            <div class="invitations-list">
              <div
                v-for="req in connectionsStore.pendingRequests"
                :key="req.id"
                class="invitation-item"
              >
                <div class="user-avatar-placeholder">
                  <i class="fa fa-user"></i>
                </div>
                <div class="invitation-details">
                  <h4 class="user-name">Profissional #{{ req.requesterId }}</h4>
                  <p class="user-headline">Especialista cadastrado no Workix</p>
                  <span class="time-stamp">{{ formatDate(req.createdAt) }}</span>
                </div>
                <div class="invitation-actions">
                  <button
                    type="button"
                    class="btn-ignore"
                    @click="connectionsStore.rejectRequest(req.id)"
                  >
                    Ignorar
                  </button>
                  <button
                    type="button"
                    class="btn-accept"
                    @click="connectionsStore.acceptRequest(req.id)"
                  >
                    <i class="fa fa-check"></i> Aceitar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Connections Grid Section -->
          <div class="network-section-card">
            <div class="section-title-wrap">
              <div class="d-flex justify-content-between align-items-center">
                <h3><i class="fa fa-handshake-o"></i> Suas Conexões Ativas ({{ connectionsStore.connectionsCount }})</h3>
                <div class="network-search-input">
                  <input
                    type="text"
                    v-model="searchTerm"
                    placeholder="Filtrar conexões..."
                    class="form-control input-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Loading Spinner -->
            <div v-if="connectionsStore.isLoading" class="loading-state">
              <i class="fa fa-spinner fa-spin"></i> Carregando sua rede...
            </div>

            <!-- Active Connections List -->
            <div v-else-if="filteredConnections.length > 0" class="row connections-grid">
              <div
                v-for="conn in filteredConnections"
                :key="conn.id"
                class="col-md-4 col-sm-6 col-xs-12"
              >
                <div class="connection-member-card">
                  <div class="member-banner"></div>
                  <div class="member-avatar">
                    <i class="fa fa-user-circle"></i>
                  </div>
                  <div class="member-info">
                    <h4 class="member-name">Profissional #{{ getConnectedUserId(conn) }}</h4>
                    <p class="member-role">Conexão de 1º Grau</p>
                    <span class="connected-since">Conectado em {{ formatDate(conn.createdAt) }}</span>
                  </div>
                  <div class="member-footer-actions">
                    <router-link to="/feed" class="btn-message-link">
                      <i class="fa fa-comment-o"></i> Ver Posts
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty Connections State -->
            <div v-else class="empty-network-box">
              <div class="empty-icon">
                <i class="fa fa-users"></i>
              </div>
              <h4>Você ainda não possui conexões ativas</h4>
              <p>Explore os candidatos e profissionais recomendados abaixo para expandir sua rede de oportunidades!</p>
            </div>
          </div>

          <!-- Suggested People Section -->
          <div class="network-section-card mt-4">
            <div class="section-title-wrap">
              <h3><i class="fa fa-compass"></i> Pessoas que Você Talvez Conheça</h3>
            </div>
            <div class="row connections-grid">
              <div
                v-for="sug in SUGGESTED_USERS"
                :key="sug.id"
                class="col-md-4 col-sm-6 col-xs-12"
              >
                <div class="connection-member-card">
                  <div class="member-banner"></div>
                  <div class="member-avatar">
                    <i class="fa fa-user-circle"></i>
                  </div>
                  <div class="member-info">
                    <h4 class="member-name">{{ sug.name }}</h4>
                    <p class="member-role">{{ sug.role }}</p>
                    <span class="degree-badge">2º grau de conexão</span>
                  </div>
                  <div class="member-footer-actions">
                    <button
                      type="button"
                      class="btn-connect-action"
                      :class="{ 'sent': connectionsStore.isRequestSent(sug.id) }"
                      :disabled="connectionsStore.isRequestSent(sug.id)"
                      @click="sendInvite(sug.id)"
                    >
                      <span v-if="connectionsStore.isRequestSent(sug.id)">
                        <i class="fa fa-check"></i> Convite Enviado
                      </span>
                      <span v-else>
                        <i class="fa fa-user-plus"></i> Conectar
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import useConnectionsStore from '../stores/connections';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const authStore = useAuthStore();
const connectionsStore = useConnectionsStore();

const activeTab = ref('all');
const searchTerm = ref('');

const SUGGESTED_USERS = [
  { id: 2, name: 'Lucas Andrade', role: 'Engenheiro de Software Sênior' },
  { id: 3, name: 'Juliana Costa', role: 'Tech Recruiter & Talent Partner' },
  { id: 4, name: 'Mariana Lima', role: 'Product Manager' },
  { id: 5, name: 'Rafael Souza', role: 'Desenvolvedor Full Stack' },
  { id: 6, name: 'Fernanda Martins', role: 'Designer de Produto / UI/UX' },
  { id: 7, name: 'Bruno Henrique', role: 'Especialista em Cloud & DevOps' }
];

onMounted(async () => {
  await connectionsStore.fetchNetworkData();
});

const filteredConnections = computed(() => {
  const currentUserId = authStore.user?.id || 1;
  return connectionsStore.connections.filter(c => {
    const otherId = String(c.userId1) === String(currentUserId) ? String(c.userId2) : String(c.userId1);
    if (!searchTerm.value) return true;
    return otherId.includes(searchTerm.value.toLowerCase());
  });
});

function getConnectedUserId(conn: any) {
  const currentUserId = authStore.user?.id || 1;
  return String(conn.userId1) === String(currentUserId) ? conn.userId2 : conn.userId1;
}

async function sendInvite(userId: number) {
  await connectionsStore.sendRequest(userId);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'recente';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
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

/* Sidebar Summary */
.network-summary-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  margin-bottom: 20px;
}

.card-header-bar {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.card-header-bar h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.summary-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-menu-list li a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid #f8fafc;
  transition: all 0.2s ease;
}

.summary-menu-list li a:hover,
.summary-menu-list li.active a {
  background: #f0f9ff;
  color: #0284c7;
  font-weight: 600;
}

.summary-menu-list li a i {
  margin-right: 8px;
  width: 16px;
}

.badge-count {
  background: #e2e8f0;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

.summary-menu-list li.active .badge-count {
  background: #0284c7;
  color: #ffffff;
}

.network-tip-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.network-tip-box h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.network-tip-box h4 i {
  color: #eab308;
}

.network-tip-box p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* Section Cards */
.network-section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.section-title-wrap {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 14px;
  margin-bottom: 20px;
}

.section-title-wrap h3 {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title-wrap h3 i {
  color: #0284c7;
}

/* Invitations List */
.invitations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.invitation-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  gap: 16px;
}

.user-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0284c7;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.invitation-details {
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.user-headline {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 4px 0;
}

.time-stamp {
  font-size: 11px;
  color: #94a3b8;
}

.invitation-actions {
  display: flex;
  gap: 8px;
}

.btn-ignore {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ignore:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.btn-accept {
  background: #0284c7;
  border: none;
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-accept:hover {
  background: #0369a1;
}

/* Member Cards Grid */
.connections-grid {
  margin-top: 10px;
}

.connection-member-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.connection-member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.member-banner {
  height: 50px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
}

.member-avatar {
  margin-top: -30px;
  font-size: 54px;
  color: #64748b;
  background: #ffffff;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.member-info {
  padding: 10px 14px 14px 14px;
}

.member-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.member-role {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 8px 0;
  min-height: 32px;
}

.connected-since,
.degree-badge {
  display: inline-block;
  font-size: 11px;
  color: #0284c7;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.member-footer-actions {
  padding: 10px 14px 16px 14px;
  border-top: 1px solid #f8fafc;
}

.btn-message-link {
  display: block;
  width: 100%;
  padding: 6px 12px;
  background: #f0f9ff;
  color: #0284c7;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-message-link:hover {
  background: #0284c7;
  color: #ffffff;
}

.btn-connect-action {
  width: 100%;
  padding: 6px 12px;
  background: #0284c7;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-connect-action:hover:not(:disabled) {
  background: #0369a1;
}

.btn-connect-action.sent {
  background: #e2e8f0;
  color: #475569;
  cursor: not-allowed;
}

.loading-state,
.empty-network-box {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 12px;
}
</style>
