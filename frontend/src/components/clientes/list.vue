<script setup lang="ts">
import { onMounted, ref } from 'vue'
import API from '@/services/api'
import type {
  PaginationDataResult,
  PaginationParams,
} from '@/common/interfaces/paginator/paginator.interface.ts'
import { statusGeneral } from '@/common/enums/statusGeneral.enum.ts'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const confirm = useConfirm()

const activeDropdown = ref<string | null>(null)
const overlayPanels = ref<any>({})
const loading = ref<boolean>(true)
const paginateData = ref<PaginationDataResult>({
  data: [],
  currentPage: 1,
  limit: 15,
  total: 0,
  totalPages: 0,
})

const paginate = ref<PaginationParams>({
  page: 1,
  limit: 15,
  filters: '',
})

const setOverlayPanelRef = (id: string) => {
  return (el: any) => {
    if (el) {
      overlayPanels.value[id] = el
    }
  }
}

const toggleDropdown = (event: Event, id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
  const panel = overlayPanels.value[id]
  if (panel) {
    panel.toggle(event)
  }
}

const handleRejectD = () => {
  toast.add({
    severity: 'info',
    summary: `Operación cancelada.`,
    life: 3000,
  })
}

const handleDelete = (event: any, userId: any) => {
  confirm.require({
    group: 'table',
    target: event.currentTarget,
    message: `¿Estás seguro de que deseas eliminar el cliente? Esta acción no se puede deshacer...   ${userId.subject}`,
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    acceptClass: 'p-button-success p-button-md px-4',
    rejectClass: 'p-button-secondary p-button-md',
    accept: async () => {
      // const result = await deleteRemove(userId.id);
      // if (result) {
      // 	window.document.location.href = '/admin/panel/gestion-usuarios';
      // }
    },
    reject: handleRejectD,
  })
}

const changeStatus = async (data: any, status: string) => {
  let statusOrigin = ''
  if (status === statusGeneral.SUSPENDED) statusOrigin = statusGeneral.SUSPENDED
  else if (data.status === statusGeneral.ENABLED) statusOrigin = statusGeneral.DISABLED
  else if (data.status === statusGeneral.DISABLED) statusOrigin = statusGeneral.ENABLED
  else if (data.status === statusGeneral.SUSPENDED) statusOrigin = statusGeneral.ENABLED

  // const result = await updateStatusUser(data.id, statusOrigin, messageSuspended.value, null)

  // if (result) {
  //   const index = paginateData.value.data.findIndex((item) => item.id === data.id)
  //   paginateData.value.data[index].status = statusOrigin
  // }
}

const onPageChange = async (event: any) => {
  paginate.value.page = event.page + 1
  paginate.value.limit = event.rows

  await listClient(paginate.value)
}

const listClient = async (paginate: PaginationParams) => {
  loading.value = true

  await API.get('/users/information/all', paginate)
    .then((res) => (paginateData.value = res.data))
    .finally(() => (loading.value = false))
}

onMounted(async () => {
  await listClient(paginate.value)
})
</script>

<template>
  <DataTable
    :loading="loading"
    :value="paginateData.data"
    :paginator="true"
    :rows="paginateData.limit"
    :rowHover="true"
    :rowsPerPageOptions="[15, 20, 30, 50]"
    :lazy="true"
    :totalRecords="paginateData.total"
    :first="(paginateData.currentPage - 1) * paginateData.limit"
    @page="onPageChange"
    size="large"
  >
    <template #empty>
      <div class="py-5 text-center">
        <i class="pi pi-info-circle mb-2 text-2xl"></i>
        <p>No hay registros disponibles para mostrar.</p>
      </div>
    </template>

    <Column field="status" header="ESTADO" class="py-1">
      <template #body="{ data }">
        <span
          v-if="data.status == statusGeneral.DISABLED"
          class="text-orange-600 font-bold"
          v-tooltip.top="'Desactivado'"
        >
          DES
        </span>
        <span
          v-else-if="data.status == statusGeneral.ENABLED"
          class="text-green-600 font-bold"
          v-tooltip.top="'Activado'"
        >
          ACT
        </span>
        <span
          v-else-if="data.status == statusGeneral.SUSPENDED"
          class="text-gray-600 font-bold"
          v-tooltip.top="'Suspendido'"
        >
          SUS
        </span>
      </template>
    </Column>

    <Column field="name" header="NOMBRES" class="py-1">
      <template #body="{ data }">
        <p class="flex items-center gap-2">
          {{ data.name }} {{ data.secondName }} {{ data.paternalSurname }} {{ data.motherSurname }}
        </p>
      </template>
    </Column>

    <Column field="email" header="EMAIL" class="py-1">
      <template #body="{ data }">
        <p class="flex items-center gap-2">
          {{ data.email || '-' }}
        </p>
      </template>
    </Column>

    <Column field="acciones" header="OPCIÓN" style="width: 50px">
      <template #body="{ data }">
        <div class="text-center">
          <Button @click="toggleDropdown($event, data.id)" severity="contrast" text>
            <font-awesome-icon :icon="['fas', 'gear']" class="fa-lg text-gray-700" />
          </Button>

          <OverlayPanel :ref="setOverlayPanelRef(data.id)" :id="data.id" :showCloseIcon="false">
            <ul class="py-1">
              <li>
                <Button class="w-full text-gray-500" text>
                  <span class="font-bold">Detalle</span>
                </Button>
              </li>

              <hr />

              <li>
                <Button class="w-full text-gray-500" text>
                  <span class="font-bold">Actualizar</span>
                </Button>
              </li>

              <hr />

              <template>
                <li v-if="data.status == statusGeneral.ENABLED">
                  <Button
                    @click="changeStatus(data, statusGeneral.DISABLED)"
                    class="w-full text-gray-500"
                    text
                  >
                    <span class="font-bold">Desactivar</span>
                  </Button>
                </li>

                <li
                  v-else-if="
                    data.status == statusGeneral.DISABLED || data.status == statusGeneral.SUSPENDED
                  "
                >
                  <Button
                    @click="changeStatus(data, statusGeneral.ENABLED)"
                    class="w-full text-gray-500"
                    text
                  >
                    <span class="font-bold">Activar</span>
                  </Button>
                </li>

                <li v-if="data.status != statusGeneral.SUSPENDED">
                  <Button
                    @click="(event) => changeStatus(data, statusGeneral.SUSPENDED)"
                    class="w-full text-gray-500"
                    text
                  >
                    <span class="font-bold">Suspender</span>
                  </Button>
                </li>
              </template>

               <li>
                <Button @click="(event) => handleDelete(event, data)" class="w-full text-gray-500" text>
                  <span class="font-bold">Eliminar</span>
                </Button>
              </li>
            </ul>
          </OverlayPanel>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped></style>
