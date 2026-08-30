<template>
  <div class="page-wrapper">
    <TheHeader />

    <LoadingOverlay :loading="loading" />

    <div v-if="company" class="company-detail-page">
      <div class="company-header-banner">
        <div class="container">
          <h2>{{ company.name }}</h2>
          <p><i class="fa fa-globe"></i> {{ company.website || 'https://empresa.com.br' }}</p>
        </div>
      </div>

      <div class="container section-padding">
        <div class="row">
          <div class="col-md-8">
            <div class="content-box">
              <h3>Sobre a Empresa</h3>
              <p>{{ company.description || 'Empresa líder de mercado buscando talentos para seu time.' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';
import api from '../services/api';

const route = useRoute();
const company = ref<any>(null);
const loading = ref(false);

async function loadCompany() {
  loading.value = true;
  try {
    const id = route.params.id as string;
    const response = await api.get(`/companies/${id}`);
    company.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar empresa:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCompany();
});
</script>

<style scoped>
.company-header-banner {
  background: #0f172a;
  color: #fff;
  padding: 40px 0;
}
.section-padding {
  padding: 50px 0;
}
.content-box {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
}
</style>
