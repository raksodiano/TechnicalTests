<script setup lang="ts">
import { useDragAndDropComponents } from '@/composables/dashboard/useDragAndDropComponents.ts'
import type {
  ComponentItem,
  Emits,
  Props,
} from '@/common/interfaces/dashboard/dashboard.interfaces.ts'

const props = withDefaults(defineProps<Props>(), {
  initialItems: () => [],
  containerClass: 'space-y-2 p-4',
  itemWrapperClass: 'flex items-center bg-white border rounded-lg shadow-sm p-3',
  dragHandleClass: '',
  removeButtonClass: '',
  showDragHandle: true,
  showRemoveButton: true,
})

const emit = defineEmits<Emits>()

// Usar el composable
const {
  parentRef,
  items,
  addItem: addItemComposable,
  removeItem: removeItemComposable,
  clearAll,
  updateItem,
  getItem,
  reorderItems,
} = useDragAndDropComponents(props.initialItems)

// Wrapper methods que emiten eventos
const addItem = (item: ComponentItem) => {
  addItemComposable(item)
  emit('item-added', item)
  emit('items-updated', items.value)
}

const removeItem = (id: string | number) => {
  removeItemComposable(id)
  emit('item-removed', id)
  emit('items-updated', items.value)
}

const handleItemAction = (itemId: string | number, action: string, payload?: any) => {
  emit('item-action', itemId, action, payload)
}

// Exponer métodos y propiedades para uso externo
defineExpose({
  addItem,
  removeItem,
  clearAll,
  updateItem,
  getItem,
  reorderItems,
  items,
})
</script>

<template>
  <div ref="parentRef" :class="containerClass" class="drag-drop-container drag-drop-list">
    <div
      v-for="item in items"
      :key="item.id"
      :class="itemWrapperClass"
      class="drag-drop-item"
      :data-item-id="item.id"
    >
      <!-- Handle de arrastre -->
      <div
        v-if="showDragHandle"
        class="drag-handle flex cursor-move p-2 justify-between text-gray-400 hover:text-gray-600"
        :class="dragHandleClass"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
          />
        </svg>

        <!-- Botón de eliminar -->
        <button
          v-if="showRemoveButton"
          @click="removeItem(item.id)"
          :class="removeButtonClass"
          class="remove-button ml-2 p-1 text-red-400 hover:text-red-600 transition-colors"
          type="button"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Contenedor del componente -->
      <div class="component-wrapper flex">
        <component
          :is="item.component"
          v-bind="item.props || {}"
          :item-data="item.data"
          :item-id="item.id"
          @update-item="(updates) => updateItem(item.id, updates)"
          @remove-item="() => removeItem(item.id)"
          @item-action="(action, payload) => handleItemAction(item.id, action, payload)"
        />
      </div>
    </div>

    <!-- Slot para contenido adicional -->
    <slot name="footer" :add-item="addItem" :items="items"></slot>
  </div>
</template>

<style>
@import '@/assets/dashboard/DragDropContainer.css';
</style>
