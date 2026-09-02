import { apiFetch } from '../utils/apifetch'
import type { CourseModuleSummary } from '../types/module'

export async function getCurrentModules(): Promise<CourseModuleSummary[]> {
    const res = await apiFetch('/api/modules/current')
    
    if (!res.ok) {
        throw new Error(`Failed to fetch current modules: ${res.status} ${res.statusText}`)
    }
    
    return res.json()
}