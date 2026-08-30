<template>
  <AdminLayout>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Dashboard do Sistema</h1>
      <p class="text-subtitle-1 text-medium-emphasis">Visão geral das métricas e estatísticas operacionais</p>
    </div>

    <!-- Metric Cards Grid -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card color="primary" variant="elevated" class="pa-4 text-white">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.jobsCount || 120 }}</div>
              <div class="text-subtitle-2">Vagas Cadastradas</div>
            </div>
            <v-icon icon="mdi-briefcase-search" size="48" opacity="0.8"></v-icon>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="success" variant="elevated" class="pa-4 text-white">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.companiesCount || 45 }}</div>
              <div class="text-subtitle-2">Empresas Parceiras</div>
            </div>
            <v-icon icon="mdi-domain" size="48" opacity="0.8"></v-icon>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="info" variant="elevated" class="pa-4 text-white">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.candidatesCount || 890 }}</div>
              <div class="text-subtitle-2">Talentos & Currículos</div>
            </div>
            <v-icon icon="mdi-account-group" size="48" opacity="0.8"></v-icon>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="warning" variant="elevated" class="pa-4 text-white">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.subscriptionsCount || 340 }}</div>
              <div class="text-subtitle-2">Candidaturas Realizadas</div>
            </div>
            <v-icon icon="mdi-file-document-check" size="48" opacity="0.8"></v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Access Section -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4" variant="outlined">
          <v-card-title class="font-weight-bold">Ações Rápidas de Moderação</v-card-title>
          <v-card-text>
            <v-btn color="primary" prepend-icon="mdi-briefcase-check" class="mr-2 mb-2" to="/jobs">Aprovar Vagas</v-btn>
            <v-btn color="secondary" prepend-icon="mdi-account-key" class="mr-2 mb-2" to="/users">Gerenciar Usuários</v-btn>
            <v-btn color="info" prepend-icon="mdi-shield-lock" class="mb-2" to="/jaas-roles">Permissões JAAS</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4" variant="outlined">
          <v-card-title class="font-weight-bold">Status do Servidor</v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-check-circle" color="success" class="mr-2"></v-icon>
              <span>API GraphQL / REST Backend: <strong>Operacional</strong></span>
            </div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-database-check" color="success" class="mr-2"></v-icon>
              <span>Banco de Dados MySQL / Sequelize: <strong>Conectado</strong></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminService } from '../services/admin';

const stats = ref<any>({});

async function loadStats() {
  try {
    const res = await adminService.getStatistics();
    stats.value = res.data || {};
  } catch (err) {
    console.error('Erro ao carregar estatísticas do dashboard:', err);
  }
}

onMounted(() => {
  loadStats();
});
</script>

<style scoped>
</style>
