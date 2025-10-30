import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from './context/ThemeContext'
import { Provider } from 'react-redux'
import { store } from './store'
import Header from './components/Header'
import TabsRouter from './components/TabsRouter'
import Board from './board/Board'
import Boards from './boards/Boards'
import Issues from './issues/Issues'
import TaskDrawer from './drawer/TaskDrawer'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'



function App() {

    const queryClient = new QueryClient()

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light">
                    <div className='flex flex-col h-screen overflow-hidden dark:text-slate-300 px-5'>
                        <Header />
                        <TabsRouter />
                        <div className='flex-1 flex flex-col overflow-hidden '>
                            <Routes>
                                <Route path="/" element={<Navigate to="/issues" replace />} />
                                <Route path='/boards' element={<Boards />} />
                                <Route path='/issues' element={<Issues />} />
                                <Route path='/board/:id' element={<Board />} />
                            </Routes>
                        </div>
                        <TaskDrawer />
                    </div>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    )
}

export default App
