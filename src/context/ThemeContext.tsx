// context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react'
import type { Theme, ThemeContextType, ThemeProviderProps } from '../types/theme'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = (props: ThemeProviderProps) => {

    const { children, defaultTheme } = props
    
    const [theme, setThemeState] = useState<Theme>(() => {
        // Проверяем сохраненную тему в localStorage
        const savedTheme = localStorage.getItem('theme') as Theme
        return savedTheme || defaultTheme
    })

    // Применяем тему к документу
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    const value: ThemeContextType = {
        theme,
        toggleTheme,
        setTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

// Хук для использования контекста
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}