<template>
  <AdminLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Planos de Assinatura & Monetização</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gestão e precificação dos planos Workix Premium e cotas de InMail</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Novo Plano
      </v-btn>
    </div>

    <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4" closable @click:close="successMessage = ''">
      {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="plans"
        :loading="loading"
        hover
        class="elevation-0"
      >
        <template v-slot:item.price="{ item }">
          <span v-if="item.price === 0" class="text-medium-emphasis font-weight-bold">Gratuito</span>
          <span v-else class="text-success font-weight-bold">R$ {{ formatPrice(item.price) }}</span>
        </template>
        <template v-slot:item.inmailCreditsPerMonth="{ item }">
          <v-chip size="small" color="info" variant="outlined">
            {{ item.inmailCreditsPerMonth || 0 }} InMails / mês
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Criação -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 pa-4">Criar Novo Plano de Assinatura</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field v-model="form.name" label="Nome do Plano *" required></v-text-field>
          <v-text-field v-model="form.price" label="Preço Mensal (R$) *" type="number" step="0.01" required></v-text-field>
          <v-select
            v-model="form.billingPeriod"
            label="Período de Cobrança"
            :items="['MONTHLY', 'YEARLY']"
          ></v-select>
          <v-text-field v-model="form.inmailCreditsPerMonth" label="Créditos de InMail Mensais *" type="number" required></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!form.name" @click="savePlan">Salvar Plano</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import plansAdminService, { AdminPlanItem } from '../services/plansAdmin.service';

const plans = ref<AdminPlanItem[]>([]);
const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);

const successMessage = ref('');
const errorMessage = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nome do Plano', key: 'name' },
  { title: 'Preço', key: 'price', width: '150px' },
  { title: 'Período', key: 'billingPeriod', width: '140px' },
  { title: 'Cota de InMail', key: 'inmailCreditsPerMonth', width: '180px' }
];

const form = reactive({
  name: '',
  price: 29.90,
  billingPeriod: 'MONTHLY',
  inmailCreditsPerMonth: 5
});

onMounted(() => {
  loadPlans();
});

async function loadPlans() {
  loading.value = true;
  try {
    plans.value = await plansAdminService.getPlans();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao carregar planos.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  form.name = '';
  form.price = 29.90;
  form.billingPeriod = 'MONTHLY';
  form.inmailCreditsPerMonth = 5;
  dialog.value = true;
}

async function savePlan() {
  saving.value = true;
  try {
    await plansAdminService.createPlan({
      name: form.name,
      price: Number(form.price),
      billingPeriod: form.billingPeriod,
      inmailCreditsPerMonth: Number(form.inmailCreditsPerMonth)
    });
    dialog.value = false;
    successMessage.value = 'Plano de assinatura criado com sucesso!';
    await loadPlans();
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao salvar plano.';
  } finally {
    saving.value = false;
  }
}

function formatPrice(val: number) {
  return val.toFixed(2).replace('.', ',');
}
</script>
