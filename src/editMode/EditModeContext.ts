import { createContext, useContext } from 'react'

export interface EditModeContextValue {
  editMode: boolean
  setEditMode: (value: boolean) => void
}

export const EditModeContext = createContext<EditModeContextValue | null>(null)

export function useEditMode(): EditModeContextValue {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditMode must be used within an <EditModeProvider>.')
  }
  return context
}
