<template>
  <footer class="site-footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4 col-sm-6">
          <div class="footer-widget">
            <h3>Sobre o Workix</h3>
            <p>Conectamos os melhores talentos às melhores oportunidades do mercado de trabalho de forma simples, rápida e transparente.</p>
          </div>
        </div>
        <div class="col-md-4 col-sm-6">
          <div class="footer-widget">
            <h3>Links Rápidos</h3>
            <ul class="footer-links">
              <li><router-link to="/jobs">Buscar Vagas</router-link></li>
              <li><router-link to="/candidates">Buscar Currículos</router-link></li>
              <li><router-link to="/team">Nossa Equipe</router-link></li>
              <li><router-link to="/contact">Fale Conosco</router-link></li>
            </ul>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="footer-widget">
            <h3>Boletim Informativo</h3>
            <p>Receba as melhores vagas e novidades semanalmente no seu e-mail.</p>
            <form @submit.prevent="handleSubscribe" class="newsletter-form">
              <div class="newsletter-input-group">
                <input
                  type="email"
                  v-model="email"
                  class="newsletter-input"
                  placeholder="Digite seu e-mail..."
                  required
                />
                <button class="newsletter-btn" type="submit">
                  <i class="fa fa-paper-plane"></i> Inscrever
                </button>
              </div>
              <p v-if="subscribedMessage" class="subscribe-alert mt-2">
                <i class="fa fa-check-circle"></i> {{ subscribedMessage }}
              </p>
            </form>
          </div>
        </div>
      </div>
      <div class="copyright">
        <div class="row">
          <div class="col-md-12 text-center">
            <p>&copy; {{ new Date().getFullYear() }} Workix. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const subscribedMessage = ref('');

function handleSubscribe() {
  if (email.value) {
    subscribedMessage.value = 'Inscrição realizada com sucesso!';
    email.value = '';
    setTimeout(() => {
      subscribedMessage.value = '';
    }, 4000);
  }
}
</script>

<style scoped>
.site-footer {
  background: #0f172a;
  color: #94a3b8;
  padding-top: 50px;
  padding-bottom: 25px;
  border-top: 1px solid #1e293b;
}

.site-footer h3 {
  color: #f8fafc;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: none;
}

.site-footer p {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #94a3b8;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #38bdf8;
}

.newsletter-form {
  margin-top: 15px;
}

.newsletter-input-group {
  display: flex;
  align-items: center;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.newsletter-input-group:focus-within {
  border-color: #0284c7;
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
}

.newsletter-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 14px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.newsletter-input::placeholder {
  color: #64748b;
}

.newsletter-btn {
  background: #0284c7;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 700;
  padding: 11px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
  border-radius: 0 6px 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.newsletter-btn:hover {
  background: #0369a1;
}

.subscribe-alert {
  color: #38bdf8 !important;
  font-size: 13px;
  font-weight: 600;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.copyright {
  margin-top: 40px;
  border-top: 1px solid #1e293b;
  padding-top: 20px;
}

.copyright p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}
</style>
