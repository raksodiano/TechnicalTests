export interface Props {
  itemId: string | number
  itemData?: any
  taskId?: number
}

export interface Emits {
  (e: 'update-item', updates: any): void

  (e: 'remove-item'): void

  (e: 'item-action', action: string, payload?: any): void
}
