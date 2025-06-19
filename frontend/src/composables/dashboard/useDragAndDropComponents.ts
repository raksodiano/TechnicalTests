// composables/useDragAndDropComponents.ts
import { onMounted, onUnmounted, readonly, ref, watch } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import type { ComponentItem } from '@/common/interfaces/dashboard/dashboard.interfaces.ts'

export function useDragAndDropComponents(initialItems: ComponentItem[] = []) {
  // Estado reactivo de los items
  const items = ref<ComponentItem[]>([...initialItems])

  // Crear array de IDs para el drag and drop
  const itemIds = ref(items.value.map((item) => item.id))

  // Configurar drag and drop con los IDs
  const [parentRef, draggedIds] = useDragAndDrop(itemIds.value, {
    group: 'components',
  })

  // Sincronizar cambios del drag and drop con los items
  const syncItems = () => {
    const newItems: ComponentItem[] = []
    draggedIds.value.forEach((id) => {
      const item = items.value.find((item) => item.id === id)
      if (item) {
        newItems.push(item)
      }
    })
    items.value = newItems
  }

  // Observar cambios en draggedIds
  let unwatchDraggedIds: (() => void) | null = null

  onMounted(() => {
    unwatchDraggedIds = watch(draggedIds, syncItems, { deep: true })
  })

  onUnmounted(() => {
    if (unwatchDraggedIds) {
      unwatchDraggedIds()
    }
  })

  // Métodos para manipular items
  const addItem = (item: ComponentItem) => {
    items.value.push(item)
    // itemIds.value.push(item.id)
    draggedIds.value.push(item.id)
  }

  const clearAll = () => {
    items.value = []
  }

  const removeItem = (id: string | number) => {
    const index = items.value.findIndex((item) => item.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
      const dragIndex = draggedIds.value.findIndex((dragId) => dragId === id)
      if (dragIndex > -1) {
        draggedIds.value.splice(dragIndex, 1)
      }
    }
  }

  const updateItem = (id: string | number, updates: Partial<ComponentItem>) => {
    const item = items.value.find((item) => item.id === id)
    if (item) {
      Object.assign(item, updates)
    }
  }

  const getItem = (id: string | number) => {
    return items.value.find((item) => item.id === id)
  }

  const reorderItems = (newOrder: (string | number)[]) => {
    draggedIds.value = [...newOrder]
    syncItems()
  }

  return {
    // Refs para el template
    parentRef,
    items,

    // Métodos
    addItem,
    removeItem,
    updateItem,
    getItem,
    reorderItems,
    clearAll,

    // Estado
    draggedIds: readonly(draggedIds),
  }
}
