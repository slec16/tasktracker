import { useEffect, useState } from 'react'
import { Button, IconButton } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { useBoards } from "../hooks/useBoards"
import { useTask } from '../hooks/useTasks'
import { type Task } from '../api/taskApi'
import LoadingSpinner from "../components/LoadingSpinner"

import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { closeDrawer } from '../store/drawerSlice'



const DrawerContent = ({ onCloseDrawer, drawerId }: { onCloseDrawer: () => void, drawerId: string }) => {

    const navigate = useNavigate()

    const { data: task, isLoading: isLoadingTask, isError: isErrorTask, error: errorTask } = useTask(Number(drawerId))
    const { data: boards, isLoading, isError, error } = useBoards()

    const { id, title, description, priority, status, boardId, assignee, boardName } = task?.data || {}

    const [titleValue, setTitleValue] = useState(title)
    const [descriptionValue, setDescriptionValue] = useState(description)
    const [priorityValue, setPriorityValue] = useState(priority)
    const [statusValue, setStatusValue] = useState(status)
    const [assigneeValue, setAssigneeValue] = useState(assignee)
    const [boardNameValue, setBoardNameValue] = useState(boardName)



    const priorityOptions = [
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

    const statusOptions = [
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
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
            />
            <TextField
                label="Описание"
                multiline
                minRows={4}
                maxRows={10}
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
            />
            <Divider />
            {/* Запрос всех проектов */}
            {boards && <TextField
                select
                label="Проект"
                value={boardNameValue}
            // onChange={(e) => setBoardNameValue(e.target.value)}
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
                value={priorityValue}
                onChange={(e) => setPriorityValue(e.target.value)}
            >
                {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Статус"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
            >
                {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Исполнитель"
                value={assigneeValue.fullName}
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



// const TaskDrawer = ({ drawerState, onCloseDrawer }: { drawerState: boolean, onCloseDrawer: () => void }) => {
const TaskDrawer = () => {


    // console.log(drawerData)


    const { isOpen, drawerId } = useAppSelector((state) => state.drawer)
    const dispatch = useAppDispatch()

    const handleClose = () => {
        dispatch(closeDrawer())
    }

    // if (isLoading) return <div className="items-center flex justify-center"><LoadingSpinner /></div>
    // if (isError) return <div>Ошибка: {error.message}</div>
    return (
        <Drawer
            open={isOpen}
            onClose={handleClose}
            inert={!isOpen}
            anchor='right'
            sx={{
                '& .MuiDrawer-paper': {
                    width: '25vw', // 25% от ширины viewport
                }
            }}
        >
            {}
        </Drawer >
    )
}

export default TaskDrawer