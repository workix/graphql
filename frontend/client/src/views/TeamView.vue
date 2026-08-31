<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Nossa Equipe & Liderança</h1>
        <p>Conheça os profissionais e arquitetos por trás da construção do ecossistema Workix</p>
      </div>
    </div>

    <div class="container section-padding">
      <div v-if="isLoading" class="loading-state text-center">
        <i class="fa fa-spinner fa-spin"></i> Carregando equipe...
      </div>

      <div v-else class="row">
        <div
          v-for="member in members"
          :key="member.id"
          class="col-md-6 col-sm-12 margin-bottom-24"
        >
          <div class="member-card">
            <div class="member-avatar-box">
              <img
                :src="member.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'"
                :alt="member.name"
                class="member-photo"
              />
            </div>

            <div class="member-info">
              <h3 class="member-name">{{ member.name }}</h3>
              <span class="member-role">{{ member.occupation }}</span>
              <p class="member-bio">{{ member.shortText || 'Especialista em tecnologia e soluções de alta escala.' }}</p>

              <div class="member-socials d-flex gap-8 margin-top-12">
                <a href="#" class="social-icon-btn"><i class="fa fa-linkedin"></i></a>
                <a href="#" class="social-icon-btn"><i class="fa fa-github"></i></a>
                <a href="#" class="social-icon-btn"><i class="fa fa-globe"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Join the team banner -->
      <div class="join-team-banner text-center margin-top-32">
        <h3>Quer fazer parte da nossa história?</h3>
        <p>Estamos sempre em busca de talentos excepcionais para transformar a conexão profissional no Brasil.</p>
        <router-link to="/jobs" class="btn btn-primary margin-top-12">
          <i class="fa fa-briefcase"></i> Explorar Oportunidades
        </router-link>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import membersService, { MemberModel } from '../services/members.service';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const members = ref<MemberModel[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  try {
    members.value = await membersService.allMembers();
  } finally {
    isLoading.value = false;
  }
});
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

.member-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 20px;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.member-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.member-avatar-box {
  flex-shrink: 0;
}

.member-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0284c7;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.member-role {
  font-size: 13px;
  font-weight: 600;
  color: #0284c7;
  display: block;
  margin-bottom: 8px;
}

.member-bio {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.gap-8 { gap: 8px; }
.margin-top-12 { margin-top: 12px; }
.margin-top-32 { margin-top: 32px; }
.margin-bottom-24 { margin-bottom: 24px; }

.social-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.social-icon-btn:hover {
  background: #0284c7;
  color: #ffffff;
}

.join-team-banner {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 36px 20px;
}

.join-team-banner h3 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.join-team-banner p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.loading-state {
  padding: 60px 20px;
  color: #64748b;
}
</style>
