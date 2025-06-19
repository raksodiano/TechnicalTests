<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'

interface Props {
  itemId: string | number
  itemData?: any
  city?: string
  coordinates?: { lat: number; lon: number }
}

interface Emits {
  (e: 'update-item', updates: any): void

  (e: 'remove-item'): void

  (e: 'item-action', action: string, payload?: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const weather = ref(null)
const loading = ref(false)

const getWeatherIcon = (condition: string) => {
  const iconMap = {
    soleado: 'pi pi-sun',
    nublado: 'pi pi-cloud',
    lluvioso: 'pi pi-cloud-rain',
    tormentoso: 'pi pi-bolt',
    nevado: 'pi pi-snowflake',
  }
  return iconMap[condition] || 'pi pi-sun'
}

// Simular llamada a API del clima
const fetchWeather = async (city: string = 'Medellín') => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Simular datos del clima
    const conditions = ['soleado', 'nublado', 'lluvioso', 'tormentoso']
    const condition = conditions[Math.floor(Math.random() * conditions.length)]

    weather.value = {
      city,
      temperature: Math.floor(Math.random() * 15) + 18, // 18-33°C
      condition,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
      pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
      lastUpdated: new Date().toISOString(),
    }

    emit('update-item', { data: { ...props.itemData, weather: weather.value } })
  } catch (error) {
    console.error('Error fetching weather:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.itemData?.weather) {
    weather.value = props.itemData.weather
  } else {
    fetchWeather(props.city)
  }
})
</script>

<template>
  <Card class="w-70">
    <template #header>
      <div class="flex justify-between p-4">
        <div class="flex justify-between items-center">
          <h3 class="block text-muted-color font-medium">Clima</h3>
        </div>
      </div>
    </template>

    <template #content>
      <div v-if="loading && !weather" class="flex justify-center p-4">
        <ProgressSpinner style="width: 30px; height: 30px" />
      </div>

      <div v-else-if="weather" class="space-y-3">
        <div class="text-center">
          <h4 class="text-xl font-bold">{{ weather.city }}</h4>
          <div class="flex items-center justify-center space-x-2 mt-2">
            <i :class="getWeatherIcon(weather.condition)" class="text-3xl"></i>
            <span class="text-3xl font-bold">{{ weather.temperature }}°C</span>
          </div>
          <p class="text-gray-600 capitalize">{{ weather.condition }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-3 border-t">
          <div class="text-center">
            <i class="pi pi-eye text-gray-400"></i>
            <p class="text-sm text-gray-600">Visibilidad</p>
            <p class="font-medium">{{ weather.visibility }} km</p>
          </div>
          <div class="text-center">
            <i class="pi pi-send text-gray-400"></i>
            <p class="text-sm text-gray-600">Viento</p>
            <p class="font-medium">{{ weather.windSpeed }} km/h</p>
          </div>
          <div class="text-center">
            <i class="pi pi-tint text-gray-400"></i>
            <p class="text-sm text-gray-600">Humedad</p>
            <p class="font-medium">{{ weather.humidity }}%</p>
          </div>
          <div class="text-center">
            <i class="pi pi-gauge text-gray-400"></i>
            <p class="text-sm text-gray-600">Presión</p>
            <p class="font-medium">{{ weather.pressure }} hPa</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center p-4 text-gray-500">Error al cargar datos del clima</div>
    </template>
  </Card>
</template>
