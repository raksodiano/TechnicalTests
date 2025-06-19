<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
</script>

<template>
  <main class="flex min-h-screen">
    <Sidebar></Sidebar>
    <div class="flex grow p-8 bg-gray-500">
      <slot name="content">
        <router-view />
      </slot>
    </div>
  </main>
</template>

<style scoped></style>
