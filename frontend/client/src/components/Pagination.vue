<template>
  <nav v-if="totalPages > 1" class="text-center">
    <ul class="pagination">
      <li :class="{ disabled: currentPage === 1 }">
        <a href="#" @click.prevent="changePage(currentPage - 1)">&laquo; Anterior</a>
      </li>
      <li v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
        <a href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li :class="{ disabled: currentPage === totalPages }">
        <a href="#" @click.prevent="changePage(currentPage + 1)">Próximo &raquo;</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

function changePage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page);
  }
}
</script>

<style scoped>
.pagination {
  margin: 30px 0;
}
</style>
