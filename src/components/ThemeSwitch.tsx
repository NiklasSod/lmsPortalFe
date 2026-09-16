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
    <div className="mx-4">
      <Dropdown
        drop="up"
        onSelect={(selectedTheme) => changeTheme(selectedTheme as StoredTheme)}
      >
        <Dropdown.Toggle 
          size="sm" 
          variant="outline-secondary"
          className="d-flex align-items-center gap-2"
        >
          <span aria-hidden="true">{currentOption?.icon || '💻'}</span>
          <span>{currentOption?.label || 'Choose theme'}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ minWidth: 'auto', width: '8.5rem' }}>
          {themeOptions.map(({ id, label, icon }) => (
            <Dropdown.Item
              key={id}
              className="d-flex align-items-center"
              eventKey={id}
              active={currentTheme === id}
            >
              <span className="me-2" aria-hidden="true">
                {icon}
              </span>
              <span>{label}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}