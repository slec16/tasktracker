
import DarkModeIcon from '@mui/icons-material/DarkMode'
import IconButton from '@mui/material/IconButton'
import SunnyIcon from '@mui/icons-material/Sunny'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useTheme } from '../context/ThemeContext'

const Header = () => {

    const { theme, toggleTheme } = useTheme()

    return (
        <header className="w-full flex justify-between px-3 py-5">
            <p className='text-4xl font-light'><span className='text-sky-600 dark:text-orange-500 font-bold'>T</span>ask<span className='text-sky-600 dark:text-orange-500 font-bold'>T</span>racker</p>
            <div>
                <IconButton onClick={toggleTheme}>
                    {theme === 'light' ? <DarkModeIcon color='primary' /> : <SunnyIcon color='primary' />}
                </IconButton>
                <IconButton>
                    <AccountCircleIcon color='primary' />
                </IconButton>
            </div>
        </header>
    )
}

export default Header