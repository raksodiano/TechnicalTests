<script setup>
import { ProductService } from '@/services/ProductService.js'
import { onMounted, ref } from 'vue'

const products = ref(null)

onMounted(() => {
  ProductService.getProductsMoreSales().then((data) => (products.value = data))
})
</script>

<template>
  <Card class="w-120">
    <template #header>
      <div class="flex justify-between p-4">
        <div>
          <span class="block text-muted-color font-medium">Productos más vendidos</span>
        </div>
        <div
          class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
          style="width: 1.5rem; height: 1.5rem"
        >
          <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
        </div>
      </div>
    </template>

    <template #content>
      <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
        <Column style="width: 15%" header="Imagen">
          <template #body="slotProps">
            <img
              :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
              :alt="slotProps.data.image"
              width="50"
              class="shadow"
            />
          </template>
        </Column>

        <Column field="code" header="Código" :sortable="true" style="width: 35%"></Column>
        <Column field="name" header="Nombre" :sortable="true" style="width: 35%"></Column>
        <Column field="quantity" header="Vendidos" :sortable="true" style="width: 35%"></Column>
      </DataTable>
    </template>
  </Card>
</template>
