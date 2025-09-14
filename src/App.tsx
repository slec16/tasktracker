import './App.css'
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header'
import TabsRouter from './components/TabsRouter'
import Board from './board/Board'
import Boards from './boards/Boards'
import Issues from './issues/Issues'
import { Routes, Route } from "react-router-dom"
import { Button } from '@mui/material';

function App() {

    return (
        <ThemeProvider defaultTheme="light">
            <div className='dark:text-slate-300'>
                <Header />
                <TabsRouter />
                <div className='flex-1 flex flex-col overflow-hidden '>
                    <Routes>
                        <Route path='/' element={<div className='text-2xl text-sky-600'><Button>ww</Button></div>}/>
                        <Route path='/boards' element={<Boards />} />
                        <Route path='/issues' element={<Issues />}/>
                        <Route path='/board/:id' element={<Board />} />
                    </Routes>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App
