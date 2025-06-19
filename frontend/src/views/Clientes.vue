<script setup lang="ts">
import layoutDefault from '../layout/default.vue'
import ListClients from '../components/clientes/list.vue'
</script>

<template>
  <layoutDefault>
    <template #content>
      <ListClients></ListClients>
    </template>
  </layoutDefault>
</template>

<style scoped></style>
