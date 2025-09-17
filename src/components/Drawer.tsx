// import { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { useBoards } from "../hooks/useBoards"


const DrawerContent = ({ onCloseDrawer, drawerData }: { onCloseDrawer: () => void, drawerData: any }) => {

    const navigate = useNavigate()
    const { data: boards, isLoading, isError, error } = useBoards()


    const priority = [
        {
            value: 'Low',
            label: 'Низкий',
        },
        {
            value: 'Medium',
            label: 'Средний',
        },
        {
            value: 'High',
            label: 'Высокий',
        }
    ]

    const status = [
        {
            value: 'Backlog',
            label: 'Бэклог',
        },
        {
            value: 'InProgress',
            label: 'В процессе',
        },
        {
            value: 'Done',
            label: 'Выполнено',
        }
    ];


    return (
        <div className='flex flex-col w-full px-5 pt-3 pb-10 gap-y-4 h-full dark:bg-gray-900'>
            <div className='flex flex-row justify-between items-center'>
                <p className='text-2xl font-bold mr-2'>Редактирование задачи</p>
                <IconButton onClick={onCloseDrawer}><CloseIcon color='secondary' /></IconButton>
            </div>
            <TextField
                label="Название"
                variant="standard"
                value={drawerData.title}
            />
            <TextField
                label="Описание"
                multiline
                minRows={4}
                maxRows={10}
                value={drawerData.description}
            />
            <Divider />
            {/* Запрос всех проектов */}
            {boards && <TextField
                select
                label="Проект"
                value={drawerData.boardName}
            >
                {boards.data.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>}
            <TextField
                select
                label="Приоритет"
                onChange={(e) => console.log(e.target)}
                value={drawerData.priority}
            >
                {priority.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Статус"
                value={drawerData.status}
            >
                {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Исполнитель"
                value={drawerData.assignee.fullName}
            />
            <div className='flex flex-row justify-between items-center mt-auto'>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate(`/board/${drawerData.boardId}`)
                        onCloseDrawer()
                    }}
                >
                    Перейти на доску
                </Button>
                <Button variant="contained" disabled>Создать/Реадактировать</Button>
            </div>
        </div>
    )
}



const TaskDrawer = ({ drawerState, onCloseDrawer, drawerData }: { drawerState: boolean, onCloseDrawer: () => void, drawerData: any }) => {

    console.log(drawerData)
    return (
        <Drawer
            open={drawerState}
            onClose={onCloseDrawer}
            anchor='right'
            sx={{
                '& .MuiDrawer-paper': {
                    width: '25vw', // 25% от ширины viewport
                    // maxWidth: '400px', // опционально: максимальная ширина
                }
            }}
        >
            <DrawerContent
                onCloseDrawer={onCloseDrawer}
                drawerData={drawerData}
            />
        </Drawer>
    )
}

export default TaskDrawer