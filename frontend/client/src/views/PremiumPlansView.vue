<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <div class="premium-badge-header">
          <i class="fa fa-diamond"></i> WORKIX PREMIUM
        </div>
        <h1>Alcance Novas Alturas na Sua Carreira</h1>
        <p>Desbloqueie mensagens InMail diretas, descubra quem visitou seu perfil e destaque-se para recrutadores</p>
      </div>
    </div>

    <div class="container section-padding">
      <!-- Active Subscription Alert -->
      <div v-if="premiumStore.isPremiumActive" class="active-sub-banner d-flex justify-content-between align-items-center flex-wrap gap-16">
        <div class="sub-info d-flex align-items-center gap-12">
          <i class="fa fa-check-circle verified-icon"></i>
          <div>
            <h4 class="margin-0">Sua Assinatura Premium está Ativa!</h4>
            <p class="margin-0 text-muted">
              Você possui <strong>{{ premiumStore.inmailCredits }} créditos de InMail</strong> disponíveis este mês.
            </p>
          </div>
        </div>
        <span class="badge-active-pill">Status: Ativo</span>
      </div>

      <!-- Pricing Plans Grid -->
      <div class="row margin-top-32">
        <div
          v-for="plan in premiumStore.plansList"
          :key="plan.id"
          class="col-md-4 col-sm-6 col-xs-12 margin-bottom-24"
        >
          <div class="plan-card" :class="{ 'plan-highlighted': plan.price > 0 && plan.price < 100 }">
            <div v-if="plan.price > 0 && plan.price < 100" class="featured-ribbon">
              MAIS POPULAR
            </div>

            <div class="plan-header">
              <h3 class="plan-name">{{ plan.name }}</h3>
              <div class="plan-price">
                <span v-if="plan.price === 0" class="price-free">Gratuito</span>
                <template v-else>
                  <span class="currency">R$</span>
                  <span class="amount">{{ formatPrice(plan.price) }}</span>
                  <span class="period">/mês</span>
                </template>
              </div>
            </div>

            <div class="plan-body">
              <ul class="features-list">
                <li :class="{ 'feature-enabled': true }">
                  <i class="fa fa-check"></i> Criação e edição de perfil profissional
                </li>
                <li :class="{ 'feature-enabled': true }">
                  <i class="fa fa-check"></i> Feed social, conexões e publicações
                </li>
                <li :class="{ 'feature-enabled': plan.price > 0, 'feature-disabled': plan.price === 0 }">
                  <i class="fa" :class="plan.price > 0 ? 'fa-check' : 'fa-times'"></i>
                  <strong>{{ plan.inmailCreditsPerMonth || 0 }} InMails</strong> por mês
                </li>
                <li :class="{ 'feature-enabled': plan.price > 0, 'feature-disabled': plan.price === 0 }">
                  <i class="fa" :class="plan.price > 0 ? 'fa-check' : 'fa-times'"></i>
                  Visualizar quem viu seu perfil (90 dias)
                </li>
                <li :class="{ 'feature-enabled': plan.price > 0, 'feature-disabled': plan.price === 0 }">
                  <i class="fa" :class="plan.price > 0 ? 'fa-check' : 'fa-times'"></i>
                  Selo Dourado Premium no Perfil
                </li>
                <li :class="{ 'feature-enabled': plan.price > 100, 'feature-disabled': plan.price <= 100 }">
                  <i class="fa" :class="plan.price > 100 ? 'fa-check' : 'fa-times'"></i>
                  Busca avançada de candidatos (Recrutamento)
                </li>
              </ul>
            </div>

            <div class="plan-footer">
              <button
                v-if="plan.price === 0"
                type="button"
                class="btn btn-block btn-outline-default"
                disabled
              >
                Plano Básico Incluso
              </button>
              <button
                v-else
                type="button"
                class="btn btn-block"
                :class="plan.price < 100 ? 'btn-primary' : 'btn-outline-primary'"
                @click="openSubscribeModal(plan)"
              >
                <i class="fa fa-bolt"></i> Assinar {{ plan.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscribe Confirmation Modal -->
      <div v-if="showModal && selectedPlan" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h3><i class="fa fa-diamond"></i> Confirmar Assinatura</h3>
            <button type="button" class="btn-close" @click="showModal = false">&times;</button>
          </div>

          <div class="modal-body">
            <div class="checkout-summary">
              <h4>{{ selectedPlan.name }}</h4>
              <div class="checkout-price">
                R$ {{ formatPrice(selectedPlan.price) }} <span>/mês</span>
              </div>
              <p class="checkout-desc">
                Você receberá {{ selectedPlan.inmailCreditsPerMonth }} créditos de InMail todo mês e acesso irrestrito às ferramentas de visibilidade e quem viu seu perfil.
              </p>
            </div>

            <div v-if="subscribeError" class="alert alert-danger margin-top-16">
              {{ subscribeError }}
            </div>

            <div class="modal-footer d-flex justify-content-end gap-10 margin-top-20">
              <button type="button" class="btn btn-default" @click="showModal = false">Cancelar</button>
              <button
                type="button"
                class="btn btn-primary"
                :disabled="isSubmitting"
                @click="confirmSubscription"
              >
                <i class="fa" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-check'"></i>
                {{ isSubmitting ? 'Ativando...' : 'Confirmar e Ativar Plano' }}
              </button>
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
import usePremiumStore from '../stores/premium';
import { SubscriptionPlanModel } from '../services/premium.service';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const premiumStore = usePremiumStore();

const showModal = ref(false);
const selectedPlan = ref<SubscriptionPlanModel | null>(null);
const isSubmitting = ref(false);
const subscribeError = ref('');

onMounted(async () => {
  await Promise.all([
    premiumStore.fetchPlans(),
    premiumStore.fetchMySubscription()
  ]);
});

function openSubscribeModal(plan: SubscriptionPlanModel) {
  selectedPlan.value = plan;
  subscribeError.value = '';
  showModal.value = true;
}

async function confirmSubscription() {
  if (!selectedPlan.value) return;
  isSubmitting.value = true;
  subscribeError.value = '';

  try {
    await premiumStore.subscribe(selectedPlan.value.id);
    showModal.value = false;
  } catch (err: any) {
    subscribeError.value = err.message || 'Erro ao processar assinatura.';
  } finally {
    isSubmitting.value = false;
  }
}

function formatPrice(val: number) {
  return val.toFixed(2).replace('.', ',');
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
  padding: 48px 0;
  margin-bottom: 24px;
}

.premium-badge-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 12px;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.page-header h1 {
  font-size: 30px;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.page-header p {
  font-size: 15px;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
}

.section-padding {
  padding-bottom: 60px;
}

.active-sub-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 16px 20px;
}

.verified-icon {
  font-size: 28px;
  color: #16a34a;
}

.badge-active-pill {
  background: #16a34a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 12px;
}

.margin-0 { margin: 0; }
.gap-16 { gap: 16px; }
.gap-12 { gap: 12px; }
.gap-10 { gap: 10px; }
.margin-top-32 { margin-top: 32px; }
.margin-bottom-24 { margin-bottom: 24px; }
.margin-top-16 { margin-top: 16px; }
.margin-top-20 { margin-top: 20px; }

/* Plan Card */
.plan-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.plan-highlighted {
  border: 2px solid #0284c7;
  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.15);
}

.featured-ribbon {
  position: absolute;
  top: 0;
  right: 0;
  background: #0284c7;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 12px;
  border-bottom-left-radius: 8px;
}

.plan-header {
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  text-align: center;
}

.plan-name {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.plan-price {
  color: #0f172a;
}

.price-free {
  font-size: 24px;
  font-weight: 800;
  color: #64748b;
}

.currency {
  font-size: 16px;
  font-weight: 700;
  vertical-align: top;
}

.amount {
  font-size: 32px;
  font-weight: 800;
}

.period {
  font-size: 13px;
  color: #64748b;
}

.plan-body {
  padding: 24px;
  flex: 1;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-enabled i {
  color: #16a34a;
}

.feature-disabled {
  color: #94a3b8;
}

.feature-disabled i {
  color: #cbd5e1;
}

.plan-footer {
  padding: 24px;
  border-top: 1px solid #f1f5f9;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-header h3 i {
  color: #eab308;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
}

.modal-body {
  padding: 24px;
}

.checkout-summary {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.checkout-summary h4 {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.checkout-price {
  font-size: 22px;
  font-weight: 800;
  color: #0284c7;
  margin-bottom: 8px;
}

.checkout-price span {
  font-size: 13px;
  color: #64748b;
}

.checkout-desc {
  font-size: 13px;
  color: #475569;
  margin: 0;
  line-height: 1.4;
}
</style>
