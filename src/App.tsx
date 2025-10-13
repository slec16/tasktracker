import { useState } from 'react';
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
import TaskDrawer from './components/Drawer'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { type Task } from './api/taskApi'



function App() {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    // const [drawerData, setDrawerData] = useState<Task | undefined>(undefined)



    const getDrawerData = (taskData: Task) => {
        // setDrawerData(taskData)
    }


    const queryClient = new QueryClient()

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light">
                    <div className='dark:text-slate-300 px-5'>
                        <Header />
                        <TabsRouter openTaskDrawer={() => setIsDrawerOpen(true)} />
                        <div className='flex-1 flex flex-col overflow-hidden '>
                            <Routes>
                                <Route path="/" element={<Navigate to="/issues" replace />} />
                                <Route path='/boards' element={<Boards />} />
                                <Route path='/issues' element={<Issues openTaskDrawer={() => setIsDrawerOpen(true)} getDrawerData={getDrawerData}/>} />
                                <Route path='/board/:id' element={<Board openTaskDrawer={() => setIsDrawerOpen(true)}/>} />
                            </Routes>
                        </div>
                        <TaskDrawer />
                            {/* drawerState={isDrawerOpen}
                            onCloseDrawer={() => setIsDrawerOpen(false)}
                            drawerData={drawerData}
                        /> */}
                    </div>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    )
}

export default App
