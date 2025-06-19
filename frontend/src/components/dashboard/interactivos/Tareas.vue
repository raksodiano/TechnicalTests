<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import ProgressBar from 'primevue/progressbar'
import ProgressSpinner from 'primevue/progressspinner'
import type { Emits, Props } from '@/common/interfaces/componentes/tareas.interfaces.ts'

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const task = ref(null)
const loading = ref(false)
const updating = ref(false)

const getStatusClass = () => {
  if (!task.value) return ''

  switch (task.value.status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

// Simular llamada a API para obtener tarea
const fetchTask = async (taskId: number = 1) => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simular datos de tarea
    const statuses = ['pending', 'in-progress', 'completed']
    const assignees = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez']

    task.value = {
      id: taskId,
      title: `Tarea #${taskId}`,
      description: `Descripción detallada de la tarea número ${taskId}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      progress: Math.floor(Math.random() * 100),
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }

    emit('update-item', { data: { ...props.itemData, task: task.value } })
  } catch (error) {
    console.error('Error fetching task:', error)
  } finally {
    loading.value = false
  }
}

const toggleTaskStatus = async () => {
  updating.value = true

  // Simular API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  task.value.status = task.value.status === 'completed' ? 'pending' : 'completed'
  task.value.progress = task.value.status === 'completed' ? 100 : Math.floor(Math.random() * 80)

  emit('update-item', { data: { ...props.itemData, task: task.value } })
  emit('item-action', 'task-status-changed', {
    taskId: task.value.id,
    newStatus: task.value.status,
  })

  updating.value = false
}

const updateProgress = () => {
  task.value.progress = Math.min(100, task.value.progress + 10)
  emit('update-item', { data: { ...props.itemData, task: task.value } })
}

onMounted(() => {
  if (props.itemData?.task) {
    task.value = props.itemData.task
  } else {
    fetchTask(props.taskId || Math.floor(Math.random() * 50) + 1)
  }
})
</script>

<template>
  <Card class="w-100">
    <template #header>
      <div class="flex justify-between p-4">
        <div class="flex justify-between items-center">
          <h3 class="block text-muted-color font-medium">Tarea</h3>
          <Chip :label="task?.status || 'loading'" :class="getStatusClass()" />
        </div>
      </div>
    </template>

    <template #content>
      <div v-if="loading" class="flex justify-center p-4">
        <ProgressSpinner style="width: 30px; height: 30px" />
      </div>

      <div v-else-if="task" class="space-y-3 gap-y-3">
        <div>
          <h4 class="font-medium">{{ task.title }}</h4>
          <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div class="flex items-center space-x-2">
            <i class="pi pi-calendar text-gray-400"></i>
            <span class="text-sm">{{ formatDate(task.dueDate) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="pi pi-user text-gray-400"></i>
            <span class="text-sm">{{ task.assignee }}</span>
          </div>
        </div>

        <ProgressBar :value="task.progress" :show-value="true" />

        <div class="flex gap-2 py-2">
          <Button
            :label="task.status === 'completed' ? 'Reabrir' : 'Completar'"
            :icon="task.status === 'completed' ? 'pi pi-undo' : 'pi pi-check'"
            size="small"
            @click="toggleTaskStatus"
            :loading="updating"
          />
          <Button
            label="Actualizar Progreso"
            icon="pi pi-plus"
            size="small"
            severity="secondary"
            @click="updateProgress"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
