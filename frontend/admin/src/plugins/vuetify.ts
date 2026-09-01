import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { i18n, useI18n } from './i18n';

export default createVuetify({
  components,
  directives,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n })
  },
  theme: {
    defaultTheme: 'workixDark',
    themes: {
      workixDark: {
        dark: true,
        colors: {
          primary: '#1E88E5',
          secondary: '#26A69A',
          accent: '#9C27B0',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#0F172A',
          surface: '#1E293B'
        }
      }
    }
  }
});

