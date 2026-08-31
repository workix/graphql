<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Central de Notificações</h1>
        <p>Acompanhe suas interações sociais, conexões, mensagens e novidades de vagas</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Sidebar Quick Filters & Settings -->
        <div class="col-md-3 col-sm-4">
          <div class="notifications-filter-card">
            <div class="card-title-bar">
              <h4>Filtrar Alertas</h4>
            </div>
            <ul class="filter-menu-list">
              <li :class="{ active: activeFilter === 'ALL' }">
                <a href="javascript:void(0)" @click="activeFilter = 'ALL'">
                  <span><i class="fa fa-bell-o"></i> Todas as Notificações</span>
                  <span class="badge-total">{{ notificationsStore.notifications.length }}</span>
                </a>
              </li>
              <li :class="{ active: activeFilter === 'UNREAD' }">
                <a href="javascript:void(0)" @click="activeFilter = 'UNREAD'">
                  <span><i class="fa fa-envelope"></i> Não Lidas</span>
                  <span class="badge-unread" v-if="notificationsStore.unreadCount > 0">{{ notificationsStore.unreadCount }}</span>
                  <span class="badge-zero" v-else>0</span>
                </a>
              </li>
              <li>
                <router-link to="/feed">
                  <span><i class="fa fa-newspaper-o"></i> Feed da Comunidade</span>
                </router-link>
              </li>
              <li>
                <router-link to="/messaging">
                  <span><i class="fa fa-comments-o"></i> Minhas Mensagens</span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="notifications-tip-card">
            <h4><i class="fa fa-shield"></i> Suas Notificações</h4>
            <p>Mantenha-se atualizado para responder rapidamente a mensagens de recrutadores e convites de networking.</p>
          </div>
        </div>

        <!-- Main Notifications Stream -->
        <div class="col-md-9 col-sm-8">
          <div class="notifications-main-card">
            <!-- Action Top Bar -->
            <div class="notifications-action-bar">
              <div class="d-flex justify-content-between align-items-center">
                <h3>
                  <i class="fa fa-bell"></i>
                  {{ activeFilter === 'UNREAD' ? 'Notificações Não Lidas' : 'Histórico de Notificações' }}
                </h3>
                <button
                  v-if="notificationsStore.unreadCount > 0"
                  type="button"
                  class="btn-mark-all-read"
                  @click="notificationsStore.markAllRead"
                >
                  <i class="fa fa-check-double"></i> Marcar todas como lidas
                </button>
              </div>
            </div>

            <!-- Loading Spinner -->
            <div v-if="notificationsStore.isLoading" class="loading-state">
              <i class="fa fa-spinner fa-spin"></i> Carregando suas notificações...
            </div>

            <!-- Notifications List -->
            <div v-else-if="displayedNotifications.length > 0" class="notifications-items-stream">
              <div
                v-for="notif in displayedNotifications"
                :key="notif.id"
                class="notification-item-row"
                :class="{ 'unread': !notif.read }"
                @click="handleNotificationClick(notif)"
              >
                <div class="notif-icon-col" :class="getNotifTypeClass(notif.type)">
                  <i :class="getNotifIcon(notif.type)"></i>
                </div>

                <div class="notif-content-col">
                  <div class="notif-header-line">
                    <h4 class="notif-title">{{ notif.title }}</h4>
                    <span class="notif-time">{{ formatDate(notif.createdAt) }}</span>
                  </div>
                  <p class="notif-body">{{ notif.body }}</p>
                </div>

                <div class="notif-status-col">
                  <span v-if="!notif.read" class="unread-dot" title="Não lida"></span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-notifications-box">
              <div class="empty-icon">
                <i class="fa fa-bell-slash-o"></i>
              </div>
              <h4>Nenhuma notificação encontrada</h4>
              <p>Você está com todas as notificações em dia no Workix!</p>
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
import { useRouter } from 'vue-router';
import useNotificationsStore from '../stores/notifications';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const router = useRouter();
const notificationsStore = useNotificationsStore();
const activeFilter = ref<'ALL' | 'UNREAD'>('ALL');

onMounted(async () => {
  await notificationsStore.fetchNotifications();
});

const displayedNotifications = computed(() => {
  if (activeFilter.value === 'UNREAD') {
    return notificationsStore.unreadNotifications;
  }
  return notificationsStore.notifications;
});

async function handleNotificationClick(notif: any) {
  if (!notif.read) {
    await notificationsStore.markRead(notif.id);
  }

  // Redirecionamento amigável por tipo
  if (notif.type === 'CONNECTION') {
    router.push('/mynetwork');
  } else if (notif.type === 'MESSAGE') {
    router.push('/messaging');
  } else if (notif.type === 'POST_REACTION' || notif.type === 'POST_COMMENT') {
    router.push('/feed');
  } else if (notif.type === 'JOB_APPLICATION') {
    router.push('/my-applications');
  }
}

function getNotifIcon(type?: string) {
  switch (type) {
    case 'CONNECTION': return 'fa fa-user-plus';
    case 'MESSAGE': return 'fa fa-comment';
    case 'POST_REACTION': return 'fa fa-thumbs-up';
    case 'POST_COMMENT': return 'fa fa-comments';
    case 'JOB_APPLICATION': return 'fa fa-briefcase';
    default: return 'fa fa-bell';
  }
}

function getNotifTypeClass(type?: string) {
  switch (type) {
    case 'CONNECTION': return 'type-connection';
    case 'MESSAGE': return 'type-message';
    case 'POST_REACTION': return 'type-reaction';
    case 'POST_COMMENT': return 'type-comment';
    case 'JOB_APPLICATION': return 'type-job';
    default: return 'type-default';
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Agora';
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

/* Filter Sidebar Card */
.notifications-filter-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  margin-bottom: 20px;
}

.card-title-bar {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.card-title-bar h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.filter-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.filter-menu-list li a {
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

.filter-menu-list li a:hover,
.filter-menu-list li.active a {
  background: #f0f9ff;
  color: #0284c7;
  font-weight: 600;
}

.filter-menu-list li a i {
  margin-right: 8px;
  width: 16px;
}

.badge-total,
.badge-zero {
  background: #e2e8f0;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

.badge-unread {
  background: #0284c7;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

.notifications-tip-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.notifications-tip-card h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.notifications-tip-card h4 i {
  color: #0284c7;
}

.notifications-tip-card p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* Main Notifications Box */
.notifications-main-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.notifications-action-bar {
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
}

.notifications-action-bar h3 {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notifications-action-bar h3 i {
  color: #0284c7;
}

.btn-mark-all-read {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #0284c7;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-mark-all-read:hover {
  background: #f0f9ff;
  border-color: #0284c7;
}

.notifications-items-stream {
  display: flex;
  flex-direction: column;
}

.notification-item-row {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
  transition: background 0.2s ease;
  gap: 16px;
}

.notification-item-row:hover {
  background: #f8fafc;
}

.notification-item-row.unread {
  background: #f0f9ff;
  border-left: 4px solid #0284c7;
}

.notif-icon-col {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.type-connection { background: #e0f2fe; color: #0284c7; }
.type-message { background: #dcfce7; color: #16a34a; }
.type-reaction { background: #fef3c7; color: #d97706; }
.type-comment { background: #f3e8ff; color: #9333ea; }
.type-job { background: #fae8ff; color: #c026d3; }
.type-default { background: #f1f5f9; color: #475569; }

.notif-content-col {
  flex: 1;
  min-width: 0;
}

.notif-header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.notif-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.notif-time {
  font-size: 11px;
  color: #94a3b8;
}

.notif-body {
  font-size: 13px;
  color: #475569;
  margin: 0;
  line-height: 1.4;
}

.notif-status-col {
  width: 20px;
  display: flex;
  justify-content: center;
}

.unread-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0284c7;
  display: inline-block;
}

.loading-state,
.empty-notifications-box {
  text-align: center;
  padding: 50px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 12px;
}
</style>
