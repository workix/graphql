<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SUPPORTED_LOCALES, setAdminLocale, type SupportedLocale } from '../plugins/i18n';

const { locale } = useI18n();

const changeLocale = (newLocale: SupportedLocale) => {
  setAdminLocale(newLocale);
};
</script>

<template>
  <v-menu location="bottom end">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        prepend-icon="mdi-translate"
        class="text-none"
      >
        {{ SUPPORTED_LOCALES.find(l => l.code === locale)?.flag }}
        <span class="d-none d-sm-inline ml-1">
          {{ SUPPORTED_LOCALES.find(l => l.code === locale)?.name }}
        </span>
      </v-btn>
    </template>
    <v-list density="compact" bg-color="#1E293B">
      <v-list-item
        v-for="lang in SUPPORTED_LOCALES"
        :key="lang.code"
        :value="lang.code"
        :active="lang.code === locale"
        @click="changeLocale(lang.code)"
      >
        <template v-slot:prepend>
          <span class="mr-2">{{ lang.flag }}</span>
        </template>
        <v-list-item-title>{{ lang.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
</style>
