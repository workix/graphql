<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Mensagens Diretas & Chat</h1>
        <p>Converse privadamente com profissionais, recrutadores e conexões da sua rede</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="messaging-card-container">
        <div class="row no-gutter">
          <!-- Left Column: Conversations List -->
          <div class="col-md-4 col-sm-5 messaging-sidebar">
            <div class="sidebar-header">
              <h3><i class="fa fa-comments"></i> Mensagens</h3>
            </div>
            <div class="search-conversations-box">
              <div class="input-group">
                <input
                  type="text"
                  v-model="searchTerm"
                  class="form-control"
                  placeholder="Pesquisar conversas..."
                />
              </div>
            </div>
            <div class="conversations-scroll-list">
              <div
                v-for="conv in filteredConversations"
                :key="conv.contactId"
                class="conversation-item"
                :class="{ active: String(messagingStore.activeContactId) === String(conv.contactId) }"
                @click="selectContact(conv.contactId)"
              >
                <div class="conv-avatar">
                  <i class="fa fa-user-circle"></i>
                </div>
                <div class="conv-info">
                  <div class="conv-top-row">
                    <h4 class="conv-name">{{ conv.contactName }}</h4>
                    <span class="conv-time">{{ conv.lastMessageDate }}</span>
                  </div>
                  <div class="conv-bottom-row">
                    <p class="conv-preview">{{ conv.lastMessage || 'Nenhuma mensagem recente' }}</p>
                    <span v-if="conv.unreadCount && conv.unreadCount > 0" class="unread-pill">
                      {{ conv.unreadCount }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Active Chat Stream -->
          <div class="col-md-8 col-sm-7 messaging-main-chat">
            <template v-if="messagingStore.activeContactId">
              <!-- Chat Header -->
              <div class="chat-header-bar">
                <div class="contact-header-info">
                  <div class="contact-header-avatar">
                    <i class="fa fa-user-circle"></i>
                  </div>
                  <div>
                    <h4>{{ activeContactName }}</h4>
                    <span class="contact-status-text"><i class="fa fa-circle text-success"></i> Conectado no Workix</span>
                  </div>
                </div>
                <div class="chat-header-actions">
                  <router-link to="/mynetwork" class="btn btn-sm btn-default" title="Ver Conexões">
                    <i class="fa fa-users"></i>
                  </router-link>
                </div>
              </div>

              <!-- Message Stream -->
              <div class="chat-messages-area" ref="messagesContainer">
                <div v-if="messagingStore.isLoading" class="loading-messages">
                  <i class="fa fa-spinner fa-spin"></i> Carregando mensagens...
                </div>

                <div v-else-if="messagingStore.messages.length > 0" class="messages-stream-list">
                  <div
                    v-for="msg in messagingStore.messages"
                    :key="msg.id"
                    class="message-row"
                    :class="{ 'sent': isSentByMe(msg), 'received': !isSentByMe(msg) }"
                  >
                    <div class="message-bubble">
                      <p class="bubble-text">{{ msg.content }}</p>
                      <span class="bubble-time">{{ formatTime(msg.createdAt) }}</span>
                    </div>
                  </div>
                </div>

                <div v-else class="empty-conversation-state">
                  <i class="fa fa-comment-o"></i>
                  <p>Início da conversa com <strong>{{ activeContactName }}</strong>.</p>
                  <span>Diga um "Olá" e inicie uma conversa profissional!</span>
                </div>
              </div>

              <!-- Chat Input Form -->
              <div class="chat-input-bar">
                <textarea
                  v-model="newMessageText"
                  class="chat-textarea"
                  placeholder="Escreva uma mensagem..."
                  rows="2"
                  @keydown.enter.exact.prevent="sendCurrentMessage"
                ></textarea>
                <button
                  type="button"
                  class="btn-send-message"
                  :disabled="!newMessageText.trim() || messagingStore.isSending"
                  @click="sendCurrentMessage"
                >
                  <i v-if="messagingStore.isSending" class="fa fa-spinner fa-spin"></i>
                  <span v-else><i class="fa fa-paper-plane"></i></span>
                </button>
              </div>
            </template>

            <!-- No Contact Selected State -->
            <div v-else class="no-chat-selected">
              <div class="no-chat-icon">
                <i class="fa fa-paper-plane-o"></i>
              </div>
              <h3>Suas Mensagens</h3>
              <p>Selecione uma conversa ao lado para visualizar o histórico e enviar mensagens diretas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAuthStore } from '../stores/auth';
import useMessagingStore from '../stores/messaging';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const authStore = useAuthStore();
const messagingStore = useMessagingStore();

const searchTerm = ref('');
const newMessageText = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const filteredConversations = computed(() => {
  if (!searchTerm.value) return messagingStore.recentConversations;
  return messagingStore.recentConversations.filter(c =>
    c.contactName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const activeContactName = computed(() => {
  return messagingStore.activeContact?.contactName || `Profissional #${messagingStore.activeContactId}`;
});

onMounted(() => {
  if (messagingStore.recentConversations.length > 0 && !messagingStore.activeContactId) {
    selectContact(messagingStore.recentConversations[0].contactId);
  }
});

async function selectContact(contactId: string | number) {
  await messagingStore.selectContact(contactId);
  scrollToBottom();
}

async function sendCurrentMessage() {
  const text = newMessageText.value.trim();
  if (!text) return;

  await messagingStore.sendMessage(text);
  newMessageText.value = '';
  scrollToBottom();
}

function isSentByMe(msg: any) {
  const currentUserId = authStore.user?.id || 1;
  return String(msg.senderId) === String(currentUserId);
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

function formatTime(dateStr?: string) {
  if (!dateStr) return 'Agora';
  try {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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

.messaging-card-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

/* Sidebar Conversations */
.messaging-sidebar {
  border-right: 1px solid #f1f5f9;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-header h3 i {
  color: #0284c7;
}

.search-conversations-box {
  padding: 12px 16px;
  border-bottom: 1px solid #f8fafc;
}

.search-conversations-box input {
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid #e2e8f0;
}

.conversations-scroll-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 12px;
}

.conversation-item:hover {
  background: #f8fafc;
}

.conversation-item.active {
  background: #f0f9ff;
  border-left: 3px solid #0284c7;
}

.conv-avatar {
  font-size: 38px;
  color: #94a3b8;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-time {
  font-size: 11px;
  color: #94a3b8;
}

.conv-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-preview {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-pill {
  background: #0284c7;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
}

/* Main Chat Section */
.messaging-main-chat {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-header-bar {
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
}

.contact-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-header-avatar {
  font-size: 34px;
  color: #0284c7;
}

.contact-header-info h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.contact-status-text {
  font-size: 11px;
  color: #64748b;
}

.contact-status-text i {
  font-size: 8px;
  margin-right: 4px;
}

.chat-messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fdfdfd;
}

.messages-stream-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row.sent {
  justify-content: flex-end;
}

.message-row.received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  position: relative;
}

.message-row.sent .message-bubble {
  background: #0284c7;
  color: #ffffff;
  border-bottom-right-radius: 2px;
}

.message-row.received .message-bubble {
  background: #f1f5f9;
  color: #0f172a;
  border-bottom-left-radius: 2px;
}

.bubble-text {
  font-size: 13px;
  line-height: 1.4;
  margin: 0 0 4px 0;
}

.bubble-time {
  font-size: 10px;
  display: block;
  text-align: right;
  opacity: 0.8;
}

.chat-input-bar {
  padding: 14px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: #ffffff;
}

.chat-textarea {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  resize: none;
  min-height: 44px;
}

.chat-textarea:focus {
  border-color: #0284c7;
}

.btn-send-message {
  background: #0284c7;
  color: #ffffff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.btn-send-message:hover:not(:disabled) {
  background: #0369a1;
}

.btn-send-message:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #64748b;
}

.no-chat-icon {
  font-size: 54px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.no-chat-selected h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.empty-conversation-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-conversation-state i {
  font-size: 40px;
  margin-bottom: 12px;
}
</style>
