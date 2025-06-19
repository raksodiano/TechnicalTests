<script setup>
import { onMounted, ref } from 'vue'

const barData = ref(null)
const barOptions = ref(null)

onMounted(() => {
  setChartOptions()
})

function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

  barData.value = {
    labels: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    datasets: [
      {
        label: 'Ventas Mensuales',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
        borderColor: documentStyle.getPropertyValue('--p-primary-500'),
        data: [85, 72, 95, 88, 70, 65, 92, 78, 86, 94, 89, 97],
      },
    ],
  }

  barOptions.value = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          usePointStyle: true,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Ventas: $${context.parsed.y}K`
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
          callback: function (value) {
            return '$' + value + 'K'
          },
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  }
}
</script>

<template>
  <Card class="w-100">
    <template #header>
      <div class="flex justify-between p-4">
        <div class="flex justify-between items-center">
          <h3 class="block text-muted-color font-medium">Reporte de Ventas Mensuales</h3>
        </div>
      </div>
    </template>

    <template #content>
      <Chart type="bar" :data="barData" :options="barOptions" />
    </template>
  </Card>
</template>
