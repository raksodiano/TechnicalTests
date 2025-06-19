export interface ComponentItem {
  id: string | number
  component: any // Componente Vue
  props?: Record<string, any> // Props para el componente
  data?: any // Datos adicionales del item
}

export interface Props {
  initialItems?: ComponentItem[]
  containerClass?: string
  itemWrapperClass?: string
  dragHandleClass?: string
  removeButtonClass?: string
  showDragHandle?: boolean
  showRemoveButton?: boolean
}

export interface Emits {
  (e: 'items-updated', items: ComponentItem[]): void

  (e: 'item-added', item: ComponentItem): void

  (e: 'item-removed', id: string | number): void

  (e: 'item-action', itemId: string | number, action: string, payload?: any): void
}
