import { Dropdown } from 'react-bootstrap'
import { useTheme } from '../hooks/useTheme'
import type { StoredTheme } from '../types/theme'

interface ThemeConfig {
  id: StoredTheme
  label: string
  icon: string
}

const themeOptions: ThemeConfig[] = [
  { 
    id: 'light', 
    label: 'Light', 
    icon: '☀️' 
  },
  { 
    id: 'dark', 
    label: 'Dark', 
    icon: '🌙' 
  },
  { 
    id: 'system', 
    label: 'Auto', 
    icon: '💻' 
  },
]

export const ThemeSwitch = () => {
  const { currentTheme, changeTheme } = useTheme()

  const currentOption = themeOptions.find((opt) => opt.id === currentTheme)

  return (
    <div className="d-flex align-items-center gap-2 justify-content-between mx-4">
      <Dropdown
        drop="up"
        onSelect={(selectedTheme) => changeTheme(selectedTheme as StoredTheme)}
      >
        <Dropdown.Toggle size="sm" variant="outline-secondary">
          {currentOption?.label || 'Choose theme'}
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ minWidth: 'auto', width: '8.5rem' }}>
          {themeOptions.map(({ id, label, icon }) => (
            <Dropdown.Item
              key={id}
              className="d-flex justify-content-between align-items-center"
              eventKey={id}
              active={currentTheme === id}
            >
              <span>{label}</span>
              <span className="ms-3" aria-hidden="true">
                {icon}
              </span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>
        {currentOption?.icon || '💻'}
      </span>
    </div>
  )
}