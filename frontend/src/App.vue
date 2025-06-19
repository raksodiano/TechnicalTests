<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { setToastInstance } from '@/utils/toast.utils.ts'

const toast = useToast()
setToastInstance(toast)
</script>

<template>
  <Toast />

  <router-view />
</template>

<style scoped></style>
