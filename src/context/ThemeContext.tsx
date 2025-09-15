// context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { getMuiTheme } from '../theme/muiTheme'
import type { Theme, ThemeContextType, ThemeProviderProps } from '../types/theme'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = (props: ThemeProviderProps) => {
    const { children, defaultTheme = 'light' } = props
    
   const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme) return savedTheme
        
        if (typeof window !== 'undefined') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) return 'dark'
        }
        
        return defaultTheme
    })

    const muiTheme = getMuiTheme(theme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            setThemeState(e.matches ? 'dark' : 'light')
        }

        mediaQuery.addEventListener('change', handleSystemThemeChange)

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange)
        }
    }, [])

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
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}