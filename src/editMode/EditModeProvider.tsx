import { useState, type ReactNode } from 'react'
import { EditModeContext } from './EditModeContext'

const STORAGE_KEY = 'editMode'

function readStoredEditMode(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditModeState] = useState<boolean>(readStoredEditMode)

  const setEditMode = (value: boolean) => {
    setEditModeState(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // Ignore storage failures (e.g. private browsing mode).
    }
  }

  return (
    <EditModeContext.Provider value={{ editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  )
}
