import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

// Estilos do Jobseek Design Spec
import './assets/bootstrap.min.css';
import './assets/font-awesome.min.css';
import './assets/style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#app');

