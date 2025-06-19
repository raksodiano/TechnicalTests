<script setup>
import { onMounted, ref, watch } from 'vue'

const pieData = ref(null)
const pieOptions = ref(null)

onMounted(() => {
  setColorOptions()
})

function setColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

  pieData.value = {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: [
          documentStyle.getPropertyValue('--p-indigo-500'),
          documentStyle.getPropertyValue('--p-purple-500'),
          documentStyle.getPropertyValue('--p-teal-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-indigo-400'),
          documentStyle.getPropertyValue('--p-purple-400'),
          documentStyle.getPropertyValue('--p-teal-400'),
        ],
      },
    ],
  }

  pieOptions.value = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  }
}

watch(
  [],
  () => {
    setColorOptions()
  },
  { immediate: true },
)
</script>

<template>
  <Card class="w-100">
    <template #header>
      <div class="flex justify-between p-4">
        <div class="flex justify-between items-center">
          <h3 class="block text-muted-color font-medium">Reporte de Doughnut</h3>
        </div>
      </div>
    </template>

    <template #content>
      <Chart type="doughnut" :data="pieData" :options="pieOptions"></Chart>
    </template>
  </Card>
</template>
