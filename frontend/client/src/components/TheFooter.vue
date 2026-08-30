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
              <li><router-link to="/post-job">Publicar uma Vaga</router-link></li>
              <li><router-link to="/post-resume">Cadastrar Currículo</router-link></li>
            </ul>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="footer-widget">
            <h3>Boletim Informativo</h3>
            <p>Receba as melhores vagas e novidades semanalmente no seu e-mail.</p>
            <form @submit.prevent="handleSubscribe" class="newsletter-form">
              <div class="input-group">
                <input type="email" v-model="email" class="form-control" placeholder="Seu e-mail" required />
                <span class="input-group-btn">
                  <button class="btn btn-primary" type="submit">Inscrever</button>
                </span>
              </div>
              <p v-if="subscribedMessage" class="text-success mt-2">{{ subscribedMessage }}</p>
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
  padding-bottom: 20px;
  border-top: 1px solid #1e293b;
}
.site-footer h3 {
  color: #f8fafc;
  font-size: 18px;
  margin-bottom: 20px;
}
.footer-links {
  list-style: none;
  padding: 0;
}
.footer-links li {
  margin-bottom: 8px;
}
.footer-links a {
  color: #94a3b8;
  text-decoration: none;
}
.footer-links a:hover {
  color: #38bdf8;
}
.copyright {
  margin-top: 40px;
  border-top: 1px solid #1e293b;
  padding-top: 20px;
}
</style>
