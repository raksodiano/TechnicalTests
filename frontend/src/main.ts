import './assets/main.css' // Asegúrate que esta línea está primero
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Importar PrimeVue y estilos
import PrimeVue from 'primevue/config'
// import 'primevue/resources/themes/lara-light-indigo/theme.css'
// import 'primevue/resources/primevue.css'
import 'primeicons/primeicons.css'

// Importar componentes específicos
import Aura from '@primeuix/themes/aura'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Message from 'primevue/message'
import Form from '@primevue/forms/form'
import FormField from '@primevue/forms/formfield'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Chart from 'primevue/chart'

import Clientes from '@/components/dashboard/informativos/Clientes.vue'
import Ventas from '@/components/dashboard/informativos/Ventas.vue'
import Comentarios from '@/components/dashboard/informativos/Comentarios.vue'
import Ordenes from '@/components/dashboard/informativos/Ordenes.vue'
import ProductosMasVendidos from '@/components/dashboard/interactivos/ProductosMasVendidos.vue'
import Tareas from '@/components/dashboard/interactivos/Tareas.vue'
import Clima from '@/components/dashboard/informativos/Clima.vue'
import Barras from '@/components/dashboard/graficos/Barras.vue'
import Doughnut from '@/components/dashboard/graficos/Doughnut.vue'
import Pie from '@/components/dashboard/graficos/Pie.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)
app.use(pinia)

app.component('Clientes', Clientes)
app.component('Ventas', Ventas)
app.component('Comentarios', Comentarios)
app.component('Ordenes', Ordenes)
app.component('ProductosMasVendidos', ProductosMasVendidos)
app.component('Tareas', Tareas)
app.component('Clima', Clima)
app.component('Barras', Barras)
app.component('Doughnut', Doughnut)
app.component('Pie', Pie)

// Registrar componentes globalmente
app.component('Avatar', Avatar)
app.component('Card', Card)
app.component('Column', Column)
app.component('Chart', Chart)
app.component('DataTable', DataTable)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)
app.component('Checkbox', Checkbox)
app.component('Divider', Divider)
app.component('Toast', Toast)
app.component('Message', Message)
app.component('Form', Form)
app.component('FormField', FormField)

app.use(router)
app.mount('#app')
