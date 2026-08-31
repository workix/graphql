<template>
  <div class="page-wrapper">
    <TheHeader />

    <div v-if="groupsStore.isLoading" class="loading-container text-center section-padding">
      <i class="fa fa-spinner fa-spin"></i> Carregando comunidade...
    </div>

    <div v-else-if="groupsStore.activeGroup" class="group-detail-page">
      <!-- Group Header Banner -->
      <div class="group-header-banner">
        <div class="container">
          <div class="group-banner-content">
            <div class="group-avatar-large">
              <i class="fa fa-users"></i>
            </div>

            <div class="group-meta-info">
              <span class="privacy-badge" :class="groupsStore.activeGroup.privacy === 'PRIVATE' ? 'badge-private' : 'badge-public'">
                <i class="fa" :class="groupsStore.activeGroup.privacy === 'PRIVATE' ? 'fa-lock' : 'fa-globe'"></i>
                {{ groupsStore.activeGroup.privacy === 'PRIVATE' ? 'Grupo Privado' : 'Grupo Público' }}
              </span>
              <h1 class="group-main-title">{{ groupsStore.activeGroup.name }}</h1>
              <p class="group-main-desc">{{ groupsStore.activeGroup.description || 'Comunidade profissional focada em compartilhamento de conhecimento e oportunidades.' }}</p>
            </div>

            <div class="group-header-actions">
              <button
                v-if="!groupsStore.isMember"
                type="button"
                class="btn btn-primary btn-join"
                :disabled="isJoining"
                @click="handleJoinGroup"
              >
                <i class="fa" :class="isJoining ? 'fa-spinner fa-spin' : 'fa-user-plus'"></i>
                {{ isJoining ? 'Ingressando...' : 'Participar do Grupo' }}
              </button>
              <span v-else class="badge-member-pill">
                <i class="fa fa-check-circle"></i> Membro Ativo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="container section-padding">
        <div class="row">
          <!-- Main Group Feed Column -->
          <div class="col-md-8 col-sm-12">
            <!-- Create Post Box in Group -->
            <div class="create-post-card">
              <div class="card-header-bar">
                <h4><i class="fa fa-pencil-square-o"></i> Iniciar uma discussão na comunidade</h4>
              </div>
              <div class="card-body">
                <div v-if="postSuccess" class="alert alert-success">Publicação enviada para a comunidade!</div>
                <div v-if="postError" class="alert alert-danger">{{ postError }}</div>

                <form @submit.prevent="handleCreatePost">
                  <textarea
                    v-model="newPostContent"
                    class="form-control"
                    rows="3"
                    placeholder="Compartilhe uma dúvida, insight ou novidade com este grupo..."
                    required
                  ></textarea>

                  <div class="d-flex justify-content-end margin-top-12">
                    <button type="submit" class="btn btn-primary" :disabled="isPosting">
                      <i class="fa" :class="isPosting ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
                      {{ isPosting ? 'Publicando...' : 'Publicar no Grupo' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Group Feed List -->
            <div class="group-posts-stream margin-top-24">
              <h3 class="stream-title"><i class="fa fa-comments"></i> Discussões Recentes</h3>

              <div v-if="groupsStore.activeGroupPosts.length > 0" class="posts-list">
                <div
                  v-for="post in groupsStore.activeGroupPosts"
                  :key="post.id"
                  class="group-post-item"
                >
                  <div class="post-item-header d-flex align-items-center gap-12">
                    <div class="author-avatar">
                      <i class="fa fa-user"></i>
                    </div>
                    <div>
                      <h5 class="author-name">Membro #{{ post.authorId }}</h5>
                      <span class="post-time">{{ formatDate(post.createdAt) }}</span>
                    </div>
                  </div>

                  <div class="post-item-body">
                    <p>{{ post.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Empty Posts Feed -->
              <div v-else class="empty-feed-box">
                <i class="fa fa-commenting-o"></i>
                <h4>Nenhuma discussão iniciada neste grupo</h4>
                <p>Seja o primeiro a compartilhar uma pergunta ou dica com os outros membros!</p>
              </div>
            </div>
          </div>

          <!-- Group Sidebar Right -->
          <div class="col-md-4 col-sm-12">
            <div class="sidebar-box">
              <h4><i class="fa fa-shield"></i> Regras da Comunidade</h4>
              <ul class="rules-list">
                <li>Seja respeitoso e cordial com todos os membros.</li>
                <li>Mantenha as postagens no tema do grupo.</li>
                <li>Evite spam e autopromoção não autorizada.</li>
              </ul>
              <hr />
              <router-link to="/groups" class="btn btn-outline-default btn-block">
                <i class="fa fa-arrow-left"></i> Ver Todos os Grupos
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="container section-padding text-center">
      <div class="empty-feed-box">
        <i class="fa fa-exclamation-triangle"></i>
        <h3>Grupo não encontrado</h3>
        <p>A comunidade solicitada não está disponível ou foi desativada.</p>
        <router-link to="/groups" class="btn btn-primary margin-top-10">Voltar para Grupos</router-link>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useGroupsStore from '../stores/groups';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const route = useRoute();
const groupsStore = useGroupsStore();

const newPostContent = ref('');
const isPosting = ref(false);
const isJoining = ref(false);
const postSuccess = ref(false);
const postError = ref('');

onMounted(async () => {
  const groupId = route.params.id as string;
  await groupsStore.fetchGroupDetails(groupId);
});

async function handleJoinGroup() {
  if (!groupsStore.activeGroup) return;
  isJoining.value = true;
  try {
    await groupsStore.joinGroup(groupsStore.activeGroup.id);
  } catch (err: any) {
    console.error(err);
  } finally {
    isJoining.value = false;
  }
}

async function handleCreatePost() {
  if (!groupsStore.activeGroup || !newPostContent.value.trim()) return;
  isPosting.value = true;
  postSuccess.value = false;
  postError.value = '';

  try {
    await groupsStore.postToGroup(groupsStore.activeGroup.id, newPostContent.value);
    newPostContent.value = '';
    postSuccess.value = true;
    setTimeout(() => {
      postSuccess.value = false;
    }, 4000);
  } catch (err: any) {
    postError.value = err.message || 'Erro ao publicar no grupo.';
  } finally {
    isPosting.value = false;
  }
}

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

.group-header-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 40px 0;
  margin-bottom: 24px;
}

.group-banner-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.group-avatar-large {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  background: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #ffffff;
  flex-shrink: 0;
}

.group-meta-info {
  flex: 1;
}

.group-main-title {
  font-size: 24px;
  font-weight: 800;
  margin: 6px 0 8px 0;
}

.group-main-desc {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
  max-width: 650px;
}

.privacy-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-public { background: rgba(14, 165, 233, 0.4); }
.badge-private { background: rgba(220, 38, 38, 0.7); }

.badge-member-pill {
  background: #16a34a;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.section-padding {
  padding-bottom: 60px;
}

.create-post-card,
.sidebar-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card-header-bar {
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.card-header-bar h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.card-body {
  padding: 20px;
}

.margin-top-12 { margin-top: 12px; }
.margin-top-24 { margin-top: 24px; }
.gap-12 { gap: 12px; }

.stream-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.group-post-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.author-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.author-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.post-time {
  font-size: 11px;
  color: #94a3b8;
}

.post-item-body {
  margin-top: 12px;
  font-size: 14px;
  color: #334155;
  line-height: 1.5;
}

.empty-feed-box,
.loading-container {
  text-align: center;
  padding: 50px 20px;
  color: #64748b;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.empty-feed-box i {
  font-size: 40px;
  color: #cbd5e1;
  margin-bottom: 12px;
}

.empty-feed-box h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.rules-list {
  padding-left: 18px;
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

.sidebar-box {
  padding: 20px;
}

.sidebar-box h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
}
</style>
