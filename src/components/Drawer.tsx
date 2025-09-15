// import { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'

const DrawerContent = ({ drawerState, onCloseDrawer }: { drawerState: boolean, onCloseDrawer: () => void }) => {

    const navigate = useNavigate()

    const currencies = [
        {
            value: '1',
            label: '1',
        },
        {
            value: '2',
            label: '2',
        },
        {
            value: '3',
            label: '3',
        }
    ];


    return (
        <div className='flex flex-col px-3 pt-3 pb-10 gap-y-4 h-full'>
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
                minRows={4}
                maxRows={10}
            // variant="standard"
            />
            <Divider />
            <TextField
                select
                label="Проект"
            >
                {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Приоритет"
            >
                {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Статус"
            >
                {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Исполнитель"
            >
                {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <div className='flex flex-row justify-between items-center mt-auto'>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate('/boards')
                        onCloseDrawer()
                    }}
                >
                    Перейти на доску
                </Button>
                <Button variant="contained">Создать</Button>
            </div>
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