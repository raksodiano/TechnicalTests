<script setup lang="ts">
</script>

<template>
  <Card class="w-85">
    <template #header>
      <div class="flex justify-between p-4">
        <div>
          <span class="block text-muted-color font-medium">Clientes</span>
        </div>
        <div
          class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
          style="width: 1.5rem; height: 1.5rem"
        >
          <i class="pi pi-users text-cyan-500 !text-xl"></i>
        </div>
      </div>
    </template>

    <template #content>
      <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div>
          <span class="text-primary font-medium text-xl"> 28441</span>
        </div>
        <div class="card mb-0">
          <span class="text-muted-color">520 nuevos registros</span>
        </div>
      </div>
    </template>
  </Card>
</template>
