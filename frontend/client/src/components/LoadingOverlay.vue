<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner">
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      <p class="mt-2">{{ message || 'Carregando...' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  message?: string;
}>();
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  min-height: 200px;
}
.spinner {
  text-align: center;
  color: #0284c7;
}
</style>
