// import { useState } from 'react'
import { IconButton } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'


const DrawerContent = ({ drawerState, onCloseDrawer }: { drawerState: boolean, onCloseDrawer: () => void }) => {


    return (
        <div className='flex flex-col px-3 py-3 gap-y-4 '>
            <div className='flex flex-row justify-between items-center'>
                <p className='text-2xl font-bold mr-2'>Создание/редактирование задачи</p>
                <IconButton onClick={onCloseDrawer}><CloseIcon color='secondary' /></IconButton>
            </div>
            <TextField
                label="Название" 
                variant="standard"
                
            />
            <TextField
                label="Описание"
                multiline
                rows={4}
                // variant="standard"
            />
        </div>
    )
}



const TaskDrawer = ({ drawerState, onCloseDrawer }: { drawerState: boolean, onCloseDrawer: () => void }) => {

    return (
        <Drawer open={drawerState} onClose={onCloseDrawer} anchor='right'>
            <DrawerContent
                drawerState={drawerState}
                onCloseDrawer={onCloseDrawer}
            />
        </Drawer>
    )
}

export default TaskDrawer