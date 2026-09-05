<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <div class="premium-badge-header">
          <i class="fa fa-diamond"></i> WORKIX PREMIUM & EMPRESAS
        </div>
        <h1 v-if="activeTab === 'candidates'">Alcance Novas Alturas na Sua Carreira</h1>
        <h1 v-else>Recrute com Velocidade e Inteligência</h1>
        
        <p v-if="activeTab === 'candidates'">
          Destaque seu currículo, descubra quais empresas visitaram seu perfil e converse diretamente com recrutadores via InMail.
        </p>
        <p v-else>
          Solução completa de Talent Acquisition: publicação de vagas, ATS Kanban, desbloqueio de contatos e inteligência de candidatos.
        </p>

        <!-- Persona Tabs Toggle -->
        <div class="persona-toggle-container margin-top-24">
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: activeTab === 'candidates' }"
            @click="activeTab = 'candidates'"
          >
            <i class="fa fa-user"></i> Para Candidatos & Profissionais
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: activeTab === 'companies' }"
            @click="activeTab = 'companies'"
          >
            <i class="fa fa-building"></i> Para Empresas & Recrutadores
          </button>
        </div>
      </div>
    </div>

    <div class="container section-padding">
      <!-- Active Subscription Alert -->
      <div
        v-if="premiumStore.isPremiumActive && activeTab === 'candidates'"
        class="active-sub-banner d-flex justify-content-between align-items-center flex-wrap gap-16 margin-bottom-32"
      >
        <div class="sub-info d-flex align-items-center gap-12">
          <i class="fa fa-check-circle verified-icon"></i>
          <div>
            <h4 class="margin-0">Sua Assinatura Premium de Candidato está Ativa!</h4>
            <p class="margin-0 text-muted">
              Você possui <strong>{{ premiumStore.inmailCredits }} créditos de InMail</strong> disponíveis este mês para falar com recrutadores.
            </p>
          </div>
        </div>
        <span class="badge-active-pill">Status: Ativo</span>
      </div>

      <!-- ==================== TAB: CANDIDATOS ==================== -->
      <div v-if="activeTab === 'candidates'" class="row">
        <!-- 1. Candidato Free -->
        <div class="col-md-4 col-sm-6 col-xs-12 margin-bottom-24">
          <div class="plan-card">
            <div class="plan-header">
              <h3 class="plan-name">Workix Free</h3>
              <span class="plan-target-badge">Candidato</span>
              <div class="plan-price">
                <span class="price-free">Gratuito</span>
              </div>
            </div>

            <div class="plan-body">
              <ul class="features-list">
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> Criação e edição de perfil profissional
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> Feed social, conexões e candidatura a vagas
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> Quem viu seu perfil (últimos 7 dias agregados)
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> Identificação nominal de empresas/recrutadores
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> Contador de aparições em buscas
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> InMails diretos para recrutadores
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> Selo Dourado Premium e Destaque no Topo
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> Acesso ilimitado ao Workix Learning LMS
                </li>
              </ul>
            </div>

            <div class="plan-footer">
              <button type="button" class="btn btn-block btn-outline-default" disabled>
                Plano Básico Incluso
              </button>
            </div>
          </div>
        </div>

        <!-- 2. Candidato Premium Mensal -->
        <div class="col-md-4 col-sm-6 col-xs-12 margin-bottom-24">
          <div class="plan-card plan-highlighted">
            <div class="featured-ribbon">MAIS POPULAR</div>

            <div class="plan-header">
              <h3 class="plan-name">Workix Premium Mensal</h3>
              <span class="plan-target-badge badge-premium">Candidato Premium</span>
              <div class="plan-price">
                <span class="currency">R$</span>
                <span class="amount">19,90</span>
                <span class="period">/mês</span>
              </div>
            </div>

            <div class="plan-body">
              <ul class="features-list">
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> Criação e edição de perfil profissional
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> Feed social, conexões e candidatura a vagas
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>5 InMails por mês</strong> para falar com recrutadores
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Quem viu seu perfil:</strong> lista nominal de empresas e recrutadores (365 dias)
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Aparições em buscas:</strong> palavras-chave e alcance
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Selo Dourado Premium</strong> e Candidatura em Destaque
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Workix Learning:</strong> cursos e certificados verificados
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Diagnóstico SSI</strong> e Recomendações de Carreira
                </li>
              </ul>
            </div>

            <div class="plan-footer">
              <button
                type="button"
                class="btn btn-block btn-primary"
                @click="openSubscribeModal(getCandidateMonthlyPlan())"
              >
                <i class="fa fa-bolt"></i> Assinar Premium Mensal
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Candidato Premium Anual -->
        <div class="col-md-4 col-sm-6 col-xs-12 margin-bottom-24">
          <div class="plan-card">
            <div class="featured-ribbon ribbon-green">ECONOMIZE 17%</div>

            <div class="plan-header">
              <h3 class="plan-name">Workix Premium Anual</h3>
              <span class="plan-target-badge badge-premium">Candidato Premium</span>
              <div class="plan-price">
                <span class="currency">R$</span>
                <span class="amount">199,00</span>
                <span class="period">/ano</span>
              </div>
              <div class="price-equivalent">Equivalente a R$ 16,58/mês</div>
            </div>

            <div class="plan-body">
              <ul class="features-list">
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Todos os recursos do Plano Mensal</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>15 InMails por mês</strong> para falar com recrutadores
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Quem viu seu perfil:</strong> lista nominal por 365 dias
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Aparições em buscas:</strong> histórico completo
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Selo Dourado Premium</strong> no perfil e buscas
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Workix Learning:</strong> catálogo ilimitado de cursos
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>2 Meses Grátis</strong> na contratação anual
                </li>
              </ul>
            </div>

            <div class="plan-footer">
              <button
                type="button"
                class="btn btn-block btn-outline-primary"
                @click="openSubscribeModal(getCandidateAnnualPlan())"
              >
                <i class="fa fa-bolt"></i> Assinar Premium Anual
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== TAB: EMPRESAS & RECRUTADORES ==================== -->
      <div v-else class="row">
        <!-- 1. Empresa Free -->
        <div class="col-md-3 col-sm-6 col-xs-12 margin-bottom-24">
          <div class="plan-card">
            <div class="plan-header">
              <h3 class="plan-name">Workix Free</h3>
              <span class="plan-target-badge">Empresa</span>
              <div class="plan-price">
                <span class="price-free">Gratuito</span>
              </div>
            </div>

            <div class="plan-body">
              <ul class="features-list">
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>1 vaga ativa simultânea</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> ATS & Kanban básico por vaga
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> Candidaturas orgânicas ilimitadas
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> 0 créditos de contato / InMail
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> 0 créditos de vaga patrocinada (Boost)
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> Vagas Confidenciais
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> Agendador de Entrevistas JaaS Vídeo
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> Inteligência de Processos Concorrentes
                </li>
              </ul>
            </div>

            <div class="plan-footer">
              <button type="button" class="btn btn-block btn-outline-default" disabled>
                Plano Básico Incluso
              </button>
            </div>
          </div>
        </div>

        <!-- 2. Empresa Starter -->
        <div class="col-md-3 col-sm-6 col-xs-12 margin-bottom-24">
          <div class="plan-card">
            <div class="plan-header">
              <h3 class="plan-name">Starter</h3>
              <span class="plan-target-badge badge-company">Recrutamento B2B</span>
              <div class="plan-price">
                <span class="currency">R$</span>
                <span class="amount">79,00</span>
                <span class="period">/mês</span>
              </div>
            </div>

            <div class="plan-body">
              <ul class="features-list">
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>3 vagas ativas simultâneas</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>10 créditos de InMail / contato</strong> por mês
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>1 vaga patrocinada (Boost)</strong> por mês
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>ATS Kanban Completo</strong> com histórico e notas
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Publicação de Vagas Confidenciais</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Inteligência de Processos Concorrentes</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> Agendador de Entrevistas & JaaS Vídeo
                </li>
                <li class="feature-disabled">
                  <i class="fa fa-times"></i> Acesso a API e Webhooks
                </li>
              </ul>
            </div>

            <div class="plan-footer">
              <button
                type="button"
                class="btn btn-block btn-outline-primary"
                @click="openSubscribeModal(getCompanyPlanByCode('starter_v1', 4, 'Starter', 79))"
              >
                <i class="fa fa-bolt"></i> Assinar Starter
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Empresa Pro -->
        <div class="col-md-3 col-sm-6 col-xs-12 margin-bottom-24">
          <div class="plan-card plan-highlighted">
            <div class="featured-ribbon">RECOMENDADO RH</div>

            <div class="plan-header">
              <h3 class="plan-name">Pro</h3>
              <span class="plan-target-badge badge-company">Recrutamento B2B</span>
              <div class="plan-price">
                <span class="currency">R$</span>
                <span class="amount">249,00</span>
                <span class="period">/mês</span>
              </div>
            </div>

            <div class="plan-body">
              <ul class="features-list">
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>10 vagas ativas simultâneas</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>60 créditos de InMail / contato</strong> por mês
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>5 vagas patrocinadas (Boosts)</strong> por mês
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>ATS Completo + Etapas Customizáveis</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Até 3 recrutadores</strong> na mesma conta
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Vagas Confidenciais</strong> ilimitadas
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Agendador & JaaS Vídeo</strong> WebRTC
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Acesso à API & Webhooks</strong> (Retenção 2 anos)
                </li>
              </ul>
            </div>

            <div class="plan-footer">
              <button
                type="button"
                class="btn btn-block btn-primary"
                @click="openSubscribeModal(getCompanyPlanByCode('pro_v1', 5, 'Pro', 249))"
              >
                <i class="fa fa-bolt"></i> Assinar Pro
              </button>
            </div>
          </div>
        </div>

        <!-- 4. Empresa Business -->
        <div class="col-md-3 col-sm-6 col-xs-12 margin-bottom-24">
          <div class="plan-card">
            <div class="featured-ribbon ribbon-dark">CORPORATIVO</div>

            <div class="plan-header">
              <h3 class="plan-name">Business</h3>
              <span class="plan-target-badge badge-company">Enterprise</span>
              <div class="plan-price">
                <span class="currency">R$</span>
                <span class="amount">699,00</span>
                <span class="period">/mês</span>
              </div>
            </div>

            <div class="plan-body">
              <ul class="features-list">
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>30 vagas ativas simultâneas</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>250 créditos de InMail / contato</strong> por mês
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>20 vagas patrocinadas (Boosts)</strong> por mês
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>ATS Ilimitado com Gestão de SLA</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Até 10 recrutadores</strong> na conta
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Trilhas LMS Corporativas</strong> exclusivas
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>API / Webhooks + Retenção Ilimitada</strong>
                </li>
                <li class="feature-enabled">
                  <i class="fa fa-check"></i> <strong>Gerente de Contas Dedicado</strong>
                </li>
              </ul>
            </div>

            <div class="plan-footer">
              <button
                type="button"
                class="btn btn-block btn-outline-primary"
                @click="openSubscribeModal(getCompanyPlanByCode('business_v1', 6, 'Business', 699))"
              >
                <i class="fa fa-bolt"></i> Assinar Business
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
                R$ {{ formatPrice(selectedPlan.price) }}
                <span>/{{ selectedPlan.billingPeriod === 'YEARLY' ? 'ano' : 'mês' }}</span>
              </div>
              <p class="checkout-desc">
                {{ getCheckoutDescription(selectedPlan) }}
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

const activeTab = ref<'candidates' | 'companies'>('candidates');
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

function getCandidateMonthlyPlan(): SubscriptionPlanModel {
  const found = premiumStore.plansList.find(
    p => p.name.toLowerCase().includes('candidato') && p.price > 0 && p.price < 50
  );
  return found || {
    id: 2,
    name: 'Workix Premium Mensal (Candidato)',
    price: 19.90,
    billingPeriod: 'MONTHLY',
    inmailCreditsPerMonth: 5
  };
}

function getCandidateAnnualPlan(): SubscriptionPlanModel {
  const found = premiumStore.plansList.find(
    p => p.name.toLowerCase().includes('anual') || (p.price >= 100 && p.price < 250)
  );
  return found || {
    id: 3,
    name: 'Workix Premium Anual (Candidato)',
    price: 199.00,
    billingPeriod: 'YEARLY',
    inmailCreditsPerMonth: 15
  };
}

function getCompanyPlanByCode(code: string, fallbackId: number, name: string, price: number): SubscriptionPlanModel {
  const found = premiumStore.plansList.find(
    p => p.name.toLowerCase().includes(name.toLowerCase()) || p.id === fallbackId
  );
  return found || {
    id: fallbackId,
    name: `Workix ${name} (Empresas)`,
    price: price,
    billingPeriod: 'MONTHLY',
    inmailCreditsPerMonth: code === 'starter_v1' ? 10 : code === 'pro_v1' ? 60 : 250
  };
}

function getCheckoutDescription(plan: SubscriptionPlanModel) {
  if (plan.name.toLowerCase().includes('candidato') || plan.price < 50) {
    return `Você receberá ${plan.inmailCreditsPerMonth || 5} créditos de InMail todo mês, identificação nominal de quem visitou seu perfil e selo dourado de destaque.`;
  }
  return `Acesso completo à plataforma de recrutamento com publicação de vagas ativas, créditos de contato com talentos e quadro Kanban.`;
}

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
  return Number(val).toFixed(2).replace('.', ',');
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
  padding: 44px 0 32px 0;
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
  padding: 4px 14px;
  border-radius: 12px;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.page-header p {
  font-size: 15px;
  color: #94a3b8;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Persona Toggle */
.persona-toggle-container {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
}

.toggle-btn {
  background: transparent;
  color: #cbd5e1;
  border: none;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-btn:hover {
  color: #ffffff;
}

.toggle-btn.active {
  background: #0284c7;
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(2, 132, 199, 0.4);
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
.margin-top-24 { margin-top: 24px; }
.margin-top-32 { margin-top: 32px; }
.margin-bottom-24 { margin-bottom: 24px; }
.margin-bottom-32 { margin-bottom: 32px; }
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
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.plan-highlighted {
  border: 2px solid #0284c7;
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.16);
}

.featured-ribbon {
  position: absolute;
  top: 0;
  right: 0;
  background: #0284c7;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 5px 14px;
  border-bottom-left-radius: 10px;
  letter-spacing: 0.5px;
}

.ribbon-green {
  background: #16a34a;
}

.ribbon-dark {
  background: #0f172a;
}

.plan-header {
  padding: 24px 20px 20px 20px;
  border-bottom: 1px solid #f1f5f9;
  text-align: center;
}

.plan-name {
  font-size: 19px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.plan-target-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.badge-premium {
  color: #ca8a04;
  background: #fef08a;
}

.badge-company {
  color: #0284c7;
  background: #e0f2fe;
}

.plan-price {
  color: #0f172a;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}

.price-free {
  font-size: 26px;
  font-weight: 800;
  color: #64748b;
}

.currency {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.amount {
  font-size: 34px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.period {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.price-equivalent {
  font-size: 12px;
  color: #16a34a;
  font-weight: 700;
  margin-top: 4px;
}

.plan-body {
  padding: 22px 20px;
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
  line-height: 1.4;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.features-list li i {
  margin-top: 2px;
  font-size: 14px;
  flex-shrink: 0;
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
  padding: 20px;
  border-top: 1px solid #f1f5f9;
  background: #fafafa;
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

