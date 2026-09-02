import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { useTheme } from '../hooks/useTheme';

export const ThemeSwitch = () => {
    const { currentTheme , changeTheme } = useTheme();

    return (
        <ButtonGroup vertical aria-label="Temaväljare" className="w-120">
            <Button
                size="sm"
                variant={currentTheme === 'light' ? 'primary' : 'outline-secondary'}
                onClick={() => changeTheme('light')}
                className="text-start"
            >
                ☀️ Ljust
            </Button>
            <Button
                size="sm"
                variant={currentTheme === 'dark' ? 'primary' : 'outline-secondary'}
                onClick={() => changeTheme('dark')}
                className="text-start"
            >
                🌙 Mörkt
            </Button>
            <Button
                size="sm"
                variant={currentTheme === 'system' ? 'primary' : 'outline-secondary'}
                onClick={() => changeTheme('system')}
                className="text-start"
            >
                💻 System
            </Button>
        </ButtonGroup>
    );
};