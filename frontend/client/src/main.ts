import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Estilos do Jobseek Design Spec
import './assets/bootstrap.min.css';
import './assets/font-awesome.min.css';
import './assets/style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');
