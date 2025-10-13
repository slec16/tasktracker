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
import InputAdornment from '@mui/material/InputAdornment'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useUpdateTask } from '../hooks/useTasks'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { closeDrawer } from '../store/drawerSlice'



const DrawerContent = ({ onCloseDrawer, drawerData, onRefresh }: { onCloseDrawer: () => void, drawerData: any, onRefresh: () => void }) => {

    const { id, title, description, priority, status, boardId, assignee, boardName } = drawerData

    const navigate = useNavigate()
    const { mutate, isPending: isMutating } = useUpdateTask(id)

    const { data: boards, isLoading, isError, error } = useBoards()


    console.log(drawerData)

    const [titleValue, setTitleValue] = useState(title)
    const [descriptionValue, setDescriptionValue] = useState(description)
    const [priorityValue, setPriorityValue] = useState(priority)
    const [statusValue, setStatusValue] = useState(status)
    const [assigneeValue, setAssigneeValue] = useState(assignee)
    const [boardNameValue, setBoardNameValue] = useState(boardName)

    useEffect(() => {
        setTitleValue(title)
        setDescriptionValue(description)
        setPriorityValue(priority)
        setStatusValue(status)
        setAssigneeValue(assignee)
        setBoardNameValue(boardName)
    }, [title, description, priority, status, assignee, boardName])

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

    const updateTaskHandler = () => {

        const newTask = {
            title: titleValue,
            description: descriptionValue,
            priority: priorityValue,
            status: statusValue,
            assigneeId: assignee.id
        }
        mutate(
            {
                id: id,
                taskData: newTask
            }, {
            onSuccess: () => {
                // setOpenSuccessSnackbar(true)
                onRefresh()
            }}
        )
    }

    return (
        <div className='flex flex-col w-full px-5 pt-3 pb-10 gap-y-4 h-full dark:bg-gray-900 relative'>
            
            {/* Заглушка во время мутации */}
            {isMutating && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg dark:bg-gray-900 dark:bg-opacity-70">
                    <div className="flex flex-col items-center">
                        {/* <CircularProgress /> */}
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Сохранение изменений...</p>
                    </div>
                </div>
            )}
            
            <div className='flex flex-row justify-between items-center'>
                <p className='text-2xl font-bold mr-2'>{id == undefined ? 'Создание задачи' : 'Редактирование задачи'}</p>
                <IconButton 
                    onClick={onCloseDrawer}
                    disabled={isMutating}
                >
                    <CloseIcon color='secondary' />
                </IconButton>
            </div>
            
            <TextField
                label="Название"
                variant="standard"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                disabled={isMutating}
            />
            <TextField
                label="Описание"
                multiline
                minRows={4}
                maxRows={10}
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                disabled={isMutating}
            />
            <Divider />

            {boards && (
                <TextField
                    select
                    label="Проект"
                    value={boardNameValue || ''}
                    onChange={(e) => setBoardNameValue(e.target.value)}
                    disabled={isMutating}
                >
                    {boards.data.map((option) => (
                        <MenuItem key={option.id} value={option.name}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            
            <TextField
                select
                label="Приоритет"
                value={priorityValue || ''}
                onChange={(e) => setPriorityValue(e.target.value)}
                disabled={isMutating}
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
                value={statusValue || ''}
                onChange={(e) => setStatusValue(e.target.value)}
                disabled={isMutating}
            >
                {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            <div className='flex flex-row justify-between items-center mt-auto'>
                <Button
                    variant="contained"
                    onClick={onCloseDrawer}
                    disabled={isMutating}
                >
                    Перейти на доску
                </Button>
                
                <Button 
                    variant="contained" 
                    onClick={updateTaskHandler}
                    disabled={isMutating}
                    // startIcon={isMutating ? <CircularProgress size={16} /> : null}
                >
                    {isMutating ? 'Сохранение...' : (id == undefined ? 'Создать' : 'Редактировать')}
                </Button>
            </div>
        </div>
    )

}


const TaskDrawer = () => {

    const { isOpen, drawerId } = useAppSelector((state) => state.drawer)
    const dispatch = useAppDispatch()

    const { data: task, isLoading, isError, error, refetch } = useTask(Number(drawerId))

    // console.log(task?.data)

    // useEffect(() => {
    //     console.log(isLoading)
    // }, [isLoading])

    const handleClose = () => {
        dispatch(closeDrawer())
    }

    const emptyTask = {
        id: undefined,
        title: '',
        description: '',
        priority: '',
        status: '',
        boardId: undefined,
        assignee: {
            id: undefined,
            fullName: '',
            email: '',
            avatarUrl: ''
        },
        boardName: ''
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
                    width: '33vw', // 33% от ширины viewport
                }
            }}
        >
            <DrawerContent
                onCloseDrawer={handleClose}
                drawerData={task ? task.data : emptyTask}
                onRefresh={refetch}
            />
        </Drawer >
    )
}

export default TaskDrawer