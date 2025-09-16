import { useState } from 'react';
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header'
import TabsRouter from './components/TabsRouter'
import Board from './board/Board'
import Boards from './boards/Boards'
import Issues from './issues/Issues'
import TaskDrawer from './components/Drawer'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

function App() {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light">
                <div className='dark:text-slate-300 px-5'>
                    <Header />
                    <TabsRouter openTaskDrawer={() => setIsDrawerOpen(true)} />
                    <div className='flex-1 flex flex-col overflow-hidden '>
                        <Routes>
                            <Route path="/" element={<Navigate to="/issues" replace />} />
                            <Route path='/boards' element={<Boards />} />
                            <Route path='/issues' element={<Issues openTaskDrawer={() => setIsDrawerOpen(true)}/>} />
                            <Route path='/board/:id' element={<Board />} />
                        </Routes>
                    </div>
                    <TaskDrawer
                        drawerState={isDrawerOpen}
                        onCloseDrawer={() => setIsDrawerOpen(false)}
                    />
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App
