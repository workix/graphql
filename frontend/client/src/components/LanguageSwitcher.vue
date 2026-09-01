<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SUPPORTED_LOCALES, setAppLocale, type SupportedLocale } from '../i18n';

const { locale } = useI18n();

const changeLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newLocale = target.value as SupportedLocale;
  setAppLocale(newLocale);
};
</script>

<template>
  <div class="language-switcher">
    <select :value="locale" @change="changeLanguage" class="locale-select" aria-label="Select Language">
      <option v-for="lang in SUPPORTED_LOCALES" :key="lang.code" :value="lang.code">
        {{ lang.flag }} {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
}

.locale-select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.locale-select:hover {
  border-color: #94a3b8;
}

.locale-select:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
}
</style>
