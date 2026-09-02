import { Dropdown } from 'react-bootstrap'
import { useTheme } from '../hooks/useTheme'

const themeIcons = {
  light: '☀️',
  dark: '🌙',
  system: '💻',
}

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

type ThemeLabels = 'light' | 'dark' | 'system'

export const ThemeSwitch = () => {
  const { currentTheme, changeTheme } = useTheme()

  return (
    <div className="d-flex align-items-center gap-2 justify-content-between mx-4">
      <Dropdown
        drop="up"
        onSelect={(selectedTheme) => changeTheme(selectedTheme as ThemeLabels)}
      >
        <Dropdown.Toggle size="sm" variant="outline-secondary">
          {themeLabels[currentTheme] || 'Choose theme'}
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ minWidth: 'auto', width: '8.5rem' }}>
          <Dropdown.Item
            className="d-flex justify-content-between align-items-center"
            eventKey="light"
            active={currentTheme === 'light'}
          >
            <span>Light</span>
            <span className="ms-3" aria-hidden="true">
              ☀️
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            className="d-flex justify-content-between align-items-center"
            eventKey="dark"
            active={currentTheme === 'dark'}
          >
            <span>Dark</span>
            <span className="ms-3" aria-hidden="true">
              🌙
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            className="d-flex justify-content-between align-items-center"
            eventKey="system"
            active={currentTheme === 'system'}
          >
            <span>System</span>
            <span className="ms-3" aria-hidden="true">
              💻
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>
        {themeIcons[currentTheme] || '💻'}
      </span>
    </div>
  )
}
