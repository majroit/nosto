import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import messages from './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const i18n = createI18n({
  locale: 'en',
  messages,
});

createApp(App)
  .use(i18n)
  .mount('#app');
