<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const toast = useToast()
const initialValues = ref({
  email: '',
  password: '',
})

const resolver = zodResolver(
  z.object({
    email: z.string().email({ message: 'Email requerido.' }),
    password: z.string().min(1, { message: 'Contraseña requerida.' }),
  }),
)

const onFormSubmit = async (e) => {
  if (e.valid) {
    await authStore
      .login({ ...e.values })
      .then((res) => {
        if (res.data) {
          toast.add({
            severity: 'success',
            summary: 'Logeado correctamente.',
            life: 3000,
          })
        }
      })
      .catch((err) => {
        console.log(err)
        toast.add({
          severity: 'error',
          summary: `${err.message}`,
          life: 3000,
        })
      })
  }
}

onMounted(async () => {
  await authStore.fetchGuestToken()
})
</script>

<template>
  <Card>
    <template #title>Iniciar Sesión</template>

    <template #content>
      <div class="card flex justify-center">
        <Form
          :resolver
          :initialValues
          @submit="onFormSubmit"
          class="flex flex-col gap-4 w-full sm:w-56"
        >
          <FormField v-slot="$field" as="section" name="email" class="flex flex-col gap-2">
            <InputText name="email" type="text" placeholder="Email" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
              {{ $field.error?.message }}
            </Message>
          </FormField>

          <FormField v-slot="$field" asChild name="password">
            <section class="flex flex-col gap-2">
              <Password
                name="password"
                type="text"
                placeholder="Contraseña"
                :feedback="false"
                toggleMask
                fluid
              />
              <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                {{ $field.error?.message }}
              </Message>
            </section>
          </FormField>

          <Button type="submit" severity="secondary" label="Login" />
        </Form>
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
