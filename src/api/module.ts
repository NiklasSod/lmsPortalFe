import { apiFetch } from '../utils/apifetch'
import type { CourseModule } from '../types/module'

export async function getCurrentModules(): Promise<CourseModule[]> {
    const res = await apiFetch('/api/modules/current')
    
    if (!res.ok) {
        throw new Error(`Failed to fetch current modules: ${res.status} ${res.statusText}`)
    }
    
    return res.json()
}