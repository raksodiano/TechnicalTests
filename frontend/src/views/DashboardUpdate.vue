<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import API from '@/services/api'
import { useToast } from 'primevue/usetoast'
import layoutDefault from '../layout/default.vue'
import DragDropContainer from '../components/dashboard/DragDropContainer.vue'
import Clientes from '@/components/dashboard/informativos/Clientes.vue'
import Ventas from '@/components/dashboard/informativos/Ventas.vue'
import Comentarios from '@/components/dashboard/informativos/Comentarios.vue'
import Ordenes from '@/components/dashboard/informativos/Ordenes.vue'
import ProductosMasVendidos from '@/components/dashboard/interactivos/ProductosMasVendidos.vue'
import Tareas from '../components/dashboard/interactivos/Tareas.vue'
import Clima from '@/components/dashboard/informativos/Clima.vue'
import Barras from '@/components/dashboard/graficos/Barras.vue'
import Doughnut from '@/components/dashboard/graficos/Doughnut.vue'
import Pie from '@/components/dashboard/graficos/Pie.vue'
import type { ComponentItem } from '@/composables/dashboard/useDragAndDropComponents.ts'
import { updateDashboards } from '@/composables/dashboard/dashboardApi.ts'

const toast = useToast()
const dragDropContainer = ref()

// Estado reactivo de los items del dashboard
const dashboard = ref<any>(null)
const dashboardItems = ref<ComponentItem[]>([])

// Métodos para agregar componentes
const addComponentCard = (
  component: any,
  name: string,
  toastOptions: {
    summary: string
    detail: string
    severity?: 'success' | 'info' | 'warn' | 'error' | 'help'
  },
  props: Record<string, any> = {},
) => {
  const newItem: ComponentItem = {
    id: uuidv4(),
    component,
    props,
    data: {},
  }

  dragDropContainer.value?.addItem({ name, ...newItem })
  toast.add({
    life: 3000,
    severity: toastOptions.severity || 'success',
    summary: toastOptions.summary,
    detail: toastOptions.detail,
  })
}

const clearAll = () => {
  dashboardItems.value.forEach((item: ComponentItem) => {
    dragDropContainer.value.removeItem(item.id)
  })

  dashboardItems.value = []

  toast.add({
    severity: 'warn',
    summary: 'Dashboard Limpiado',
    detail: 'Se eliminaron todos los componentes',
    life: 3000,
  })
}

// Event handlers
const onItemsUpdated = (items: ComponentItem[]) => {
  dashboardItems.value = items
}

const getDashboards = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  await API.get(`/users/one/${user.id}`).then((res: any) => {
    if (res.data) {
      dashboard.value = res.data?.dashboards.find((dash) => dash.status === 'ENABLED')
      const componentsAux = JSON.parse(dashboard.value.components || '[]')
      componentsAux.forEach((dash) => {
        dragDropContainer.value?.addItem({
          component: dash.componentName,
          ...dash,
        })
      })
    }
  })
}

// Guardar configuración del dashboard
const saveDashboardConfig = async () => {
  const config = dashboardItems.value.map((item) => ({
    id: item.id,
    componentName:
      item.component?.__name || item.component?.name || item?.name || item?.componentName,
    props: item.props,
    data: item.data,
  }))

  await updateDashboards(dashboard.value.id, config)
}

onMounted(async () => {
  await getDashboards()
})
</script>

<template>
  <layoutDefault>
    <template #content>
      <div class="w-full bg-gray-50 p-6">
        <div class="w-full mx-auto">
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Personalización de Dashboard</h1>
            <p class="text-gray-600">
              Arrastra y suelta los componentes para personalizar tu dashboard
            </p>
          </div>

          <!-- Controles -->
          <div class="flex gap-2 pb-6 justify-between">
            <Button
              label="Ventas"
              icon="pi pi-dollar"
              @click="
                addComponentCard(
                  Ventas,
                  'Ventas',
                  {
                    summary: 'Componente de ventas',
                    detail: 'Se agregó una nueva tarjeta de ventas',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Clientes"
              icon="pi pi-user-plus"
              @click="
                addComponentCard(
                  Clientes,
                  'Clientes',
                  {
                    summary: 'Componente de Clientes',
                    detail: 'Se agregó una nueva tarjeta de clientes',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Ordenes"
              icon="pi pi-shopping-cart"
              @click="
                addComponentCard(
                  Ordenes,
                  'Ordenes',
                  {
                    summary: 'Componente de ordenes',
                    detail: 'Se agregó una nueva tarjeta de ordenes',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Comentarios"
              icon="pi pi-comment"
              @click="
                addComponentCard(
                  Comentarios,
                  'Comentarios',
                  {
                    summary: 'Componente de comentarios',
                    detail: 'Se agregó una nueva tarjeta de comentarios',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Barras"
              icon="pi pi-chart-bar"
              @click="
                addComponentCard(
                  Barras,
                  'Barras',
                  {
                    summary: 'Componente de Barras',
                    detail: 'Se agregó una nueva tarjeta de barras',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Doughnut"
              icon="pi pi-chart-bar"
              @click="
                addComponentCard(
                  Doughnut,
                  'Doughnut',
                  {
                    summary: 'Componente de Doughnut',
                    detail: 'Se agregó una nueva tarjeta de Doughnut',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Pie"
              icon="pi pi-chart-bar"
              @click="
                addComponentCard(
                  Pie,
                  'Pie',
                  {
                    summary: 'Componente de pie',
                    detail: 'Se agregó una nueva tarjeta de pie',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Productos más vendidos"
              icon="pi pi-comment"
              @click="
                addComponentCard(
                  ProductosMasVendidos,
                  'ProductosMasVendidos',
                  {
                    summary: 'Productos más vendidos',
                    detail: 'Se agregó un nuevo elemento de productos',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Tarea"
              icon="pi pi-plus"
              @click="
                addComponentCard(
                  Tareas,
                  'Tareas',
                  {
                    summary: 'Tarea Agregada',
                    detail: 'Se agregó un nuevo elemento de tarea',
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button
              label="Clima"
              icon="pi pi-cloud"
              @click="
                addComponentCard(
                  Clima,
                  'Clima',
                  {
                    summary: 'Widget de Clima Agregado',
                    detail: `Se agregó el clima`,
                  },
                  { userId: Math.floor(Math.random() * 10) + 1 },
                )
              "
            />
            <Button label="Limpiar Todo" icon="pi pi-trash" severity="danger" @click="clearAll" />
            <Button
              label="Guardar configuración"
              icon="pi pi-save"
              severity="info"
              @click="saveDashboardConfig"
            />
          </div>

          <!-- Drag and Drop Container -->
          <DragDropContainer
            ref="dragDropContainer"
            container-class="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6"
            item-wrapper-class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            @items-updated="onItemsUpdated"
            @showEdit="false"
          >
            <template #footer="{ addItem, items }">
              <div v-if="items.length === 0" class="w-full text-center py-12">
                <i class="pi pi-inbox text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Dashboard vacío</h3>
                <p class="text-gray-500 mb-4">Agrega algunos componentes para comenzar</p>
              </div>
            </template>
          </DragDropContainer>
        </div>
      </div>
    </template>
  </layoutDefault>
</template>

<style scoped></style>
