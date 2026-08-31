<template>
  <div class="page-wrapper">
    <TheHeader />

    <div class="page-header text-center">
      <div class="container">
        <h1>Fale Conosco — Atendimento & Suporte</h1>
        <p>Tem dúvidas, sugestões, propostas comerciais ou precisa de suporte? Envie-nos uma mensagem.</p>
      </div>
    </div>

    <div class="container section-padding">
      <div class="row">
        <!-- Contact Info Column -->
        <div class="col-md-5 col-sm-12 margin-bottom-24">
          <div class="contact-info-card">
            <h3><i class="fa fa-comments-o"></i> Canais de Atendimento</h3>
            <p class="intro-p">
              Nossa equipe de suporte e parcerias corporativas está à disposição de segunda a sexta-feira, das 09h às 18h.
            </p>

            <div class="info-items margin-top-24">
              <div class="info-item d-flex gap-16">
                <div class="info-icon"><i class="fa fa-envelope-o"></i></div>
                <div>
                  <h5>E-mail de Suporte</h5>
                  <span>suporte@workix.com.br</span>
                </div>
              </div>

              <div class="info-item d-flex gap-16">
                <div class="info-icon"><i class="fa fa-briefcase"></i></div>
                <div>
                  <h5>Parcerias & Anunciantes</h5>
                  <span>comercial@workix.com.br</span>
                </div>
              </div>

              <div class="info-item d-flex gap-16">
                <div class="info-icon"><i class="fa fa-map-marker"></i></div>
                <div>
                  <h5>Sede & Operações</h5>
                  <span>Av. Paulista, 1000 — Bela Vista, São Paulo/SP</span>
                </div>
              </div>
            </div>

            <hr class="margin-top-24" />

            <div class="social-links-box">
              <h5>Conecte-se conosco</h5>
              <div class="d-flex gap-10 margin-top-10">
                <a href="#" class="social-pill"><i class="fa fa-linkedin"></i> LinkedIn</a>
                <a href="#" class="social-pill"><i class="fa fa-github"></i> GitHub</a>
                <a href="#" class="social-pill"><i class="fa fa-youtube-play"></i> YouTube</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form Column -->
        <div class="col-md-7 col-sm-12">
          <div class="contact-form-card">
            <div v-if="isSuccess" class="success-box text-center">
              <i class="fa fa-check-circle success-icon"></i>
              <h3>Mensagem Enviada com Sucesso!</h3>
              <p>Recebemos sua solicitação e entraremos em contato o mais breve possível no seu e-mail.</p>
              <button type="button" class="btn btn-primary margin-top-16" @click="resetForm">
                Enviar Outra Mensagem
              </button>
            </div>

            <form v-else @submit.prevent="handleSubmit">
              <h3><i class="fa fa-pencil-square-o"></i> Envie sua Mensagem</h3>
              <p class="form-sub">Preencha os campos abaixo para falar diretamente com a nossa equipe.</p>

              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

              <div class="form-group margin-top-16">
                <label>Nome Completo *</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div class="form-group">
                <label>E-mail para Contato *</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="seu.email@dominio.com"
                  required
                />
              </div>

              <div class="form-group">
                <label>Assunto *</label>
                <input
                  v-model="form.subject"
                  type="text"
                  class="form-control"
                  placeholder="Ex: Dúvida sobre Assinatura Premium / Parceria Comercial"
                  required
                />
              </div>

              <div class="form-group">
                <label>Mensagem *</label>
                <textarea
                  v-model="form.message"
                  class="form-control"
                  rows="5"
                  placeholder="Escreva detalhadamente sua dúvida, sugestão ou solicitação..."
                  required
                ></textarea>
              </div>

              <div class="form-footer margin-top-20">
                <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="isSubmitting">
                  <i class="fa" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
                  {{ isSubmitting ? 'Enviando mensagem...' : 'Enviar Mensagem' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import formsService from '../services/forms.service';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const isSubmitting = ref(false);
const isSuccess = ref(false);
const errorMessage = ref('');

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

async function handleSubmit() {
  errorMessage.value = '';
  if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
    errorMessage.value = 'Por favor, preencha todos os campos obrigatórios.';
    return;
  }

  isSubmitting.value = true;
  try {
    await formsService.createForm({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message
    });
    isSuccess.value = true;
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao enviar mensagem. Tente novamente.';
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  form.name = '';
  form.email = '';
  form.subject = '';
  form.message = '';
  isSuccess.value = false;
  errorMessage.value = '';
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

.contact-info-card,
.contact-form-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.contact-info-card h3,
.contact-form-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-info-card h3 i,
.contact-form-card h3 i {
  color: #0284c7;
}

.intro-p,
.form-sub {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.gap-16 { gap: 16px; }
.gap-10 { gap: 10px; }
.margin-top-24 { margin-top: 24px; }
.margin-top-16 { margin-top: 16px; }
.margin-top-20 { margin-top: 20px; }
.margin-top-10 { margin-top: 10px; }
.margin-bottom-24 { margin-bottom: 24px; }

.info-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f0f9ff;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.info-item h5 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.info-item span {
  font-size: 13px;
  color: #475569;
}

.social-pill {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #334155;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.social-pill:hover {
  background: #e2e8f0;
}

/* Success Box */
.success-box {
  padding: 40px 20px;
}

.success-icon {
  font-size: 50px;
  color: #16a34a;
  margin-bottom: 12px;
}

.success-box h3 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.success-box p {
  font-size: 14px;
  color: #475569;
}
</style>
