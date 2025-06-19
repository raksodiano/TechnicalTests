<script setup lang="ts">
import layoutDefault from '../layout/default.vue'
import { onMounted, ref } from 'vue'
import { getDashboards } from '@/composables/dashboard/dashboardApi.ts'

const dashboardItems = ref<any[]>([])

onMounted(async () => {
  await getDashboards(dashboardItems)
})
</script>

<template>
  <layoutDefault>
    <template #content>
      <div class="w-full bg-gray-50 p-6">
        <div class="drag-drop-container drag-drop-list">
          <div
            v-for="item in dashboardItems"
            :key="item.id"
            class="drag-drop-item"
            :data-item-id="item.id"
          >
            <!-- Contenedor del componente -->
            <div class="component-wrapper flex">
              <component
                :is="item.componentName"
                v-bind="item.props || {}"
                :item-data="item.data"
                :item-id="item.id"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </layoutDefault>
</template>

<style>
@import '@/assets/dashboard/dashboard.css';
</style>
