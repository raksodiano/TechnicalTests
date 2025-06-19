import API from '@/services/api'
import { showToast } from '@/utils/toast.utils.ts'

// Guardar configuración del dashboard
export const getDashboards = async (dashboardItems: ref<any>) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  await API.get(`/users/one/${user.id}`).then((res: any) => {
    if (res.data) {
      const dashboard = res.data?.dashboards.find((dash) => dash.status === 'ENABLED')
      dashboardItems.value = JSON.parse(dashboard.components || '[]')
    }
  })
}

export const createDashboards = async (config: any) => {
  await API.post('/dashboard/create', { components: JSON.stringify(config) }).then((res) => {
    if (res.data) {
      showToast('success', 'Configuración Guardada', 'El dashboard se guardó correctamente')
    }
  })
}

export const updateDashboards = async (id: string, config: any) => {
  await API.patch(`/dashboard/update/${id}`, {
    components: JSON.stringify(config),
  }).then((res) => {
    if (res.data) {
      showToast('success', 'Configuración Guardada', 'El dashboard se guardó correctamente')
    }
  })
}
