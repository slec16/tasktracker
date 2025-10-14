import { useEffect, useState } from 'react'
import { Button, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { useBoards } from "../hooks/useBoards"
import { useUsers } from '../hooks/useUsers'
import { type Task } from '../api/taskApi'
import { useUpdateTask } from '../hooks/useTasks'
import DrawerProgress from './DrawerProgress'
import { useAppSelector } from '../hooks/redux'


const DrawerContent = ({ onCloseDrawer, drawerData, onRefresh }: { onCloseDrawer: () => void, drawerData: Task, onRefresh: () => void }) => {

    const { id, title, description, priority, status, assignee, boardName } = drawerData
    const { boardId } = useAppSelector((state) => state.drawer)

    const navigate = useNavigate()
    const { mutate, isPending: isMutating } = useUpdateTask(id)

    const { data: boards } = useBoards()
    const { data: users } = useUsers()

    const usersForAutocompleate = users?.data.map(el => ({
        ...el,
        label: el.fullName
    }))

    const [titleValue, setTitleValue] = useState(title)
    const [descriptionValue, setDescriptionValue] = useState(description)
    const [priorityValue, setPriorityValue] = useState(priority)
    const [statusValue, setStatusValue] = useState(status)
    const [boardNameValue, setBoardNameValue] = useState(boardName)

    const [assigneeValue, setAssigneeValue] = useState<{
        label: string;
        id: number;
        fullName: string;
        email: string;
        description: string;
        avatarUrl: string;
    } | null>(
        usersForAutocompleate?.find(el => el.id === assignee?.id) || null
    );

    useEffect(() => {
        setTitleValue(title)
        setDescriptionValue(description)
        setPriorityValue(priority)
        setStatusValue(status)
        setAssigneeValue(usersForAutocompleate?.find(el => el.id === assignee?.id) || null)
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
            assigneeId: assigneeValue?.id || assignee.id
        }
        mutate(
            {
                id: id,
                taskData: newTask
            }, {
            onSuccess: () => {
                // setOpenSuccessSnackbar(true)
                onRefresh()
            }
        }
        )
    }

    return (
        <div className='flex flex-col w-full px-5 pt-3 pb-10 gap-y-4 h-full dark:bg-gray-900 relative'>

            <div className='flex flex-row justify-between items-center'>
                <p className='text-2xl font-bold mr-2'>{id == undefined ? 'Создание задачи' : 'Редактирование задачи'}</p>
                <IconButton
                    onClick={onCloseDrawer}
                    disabled={isMutating}
                >
                    <CloseIcon color='secondary' />
                </IconButton>
            </div>
            {!isMutating ?
                <>

                    <TextField
                        label="Название"
                        variant="standard"
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        disabled={isMutating}
                    />
                    <TextField
                        label="Описание"
                        variant="standard"
                        multiline
                        minRows={4}
                        maxRows={10}
                        value={descriptionValue}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        disabled={isMutating}
                    />

                    {id !== undefined ?
                        <TextField
                            label="Проект"
                            variant="standard"
                            value={boardNameValue || ''}
                            disabled={true}
                            sx={{
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.3)'
                                            : 'rgba(0, 0, 0, 0.22)',
                                    borderBottomStyle: 'solid',
                                    borderBottomWidth: '1px',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.5)'
                                            : 'rgba(0, 0, 0, 0.42)',
                                    borderBottomStyle: 'solid',
                                    borderBottomWidth: '2px',
                                },
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.7)'
                                            : 'rgba(0, 0, 0, 0.8)',
                                    backgroundColor: 'transparent',
                                },
                                '& .MuiInputLabel-root.Mui-disabled': {
                                    color: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.5)'
                                            : 'rgba(0, 0, 0, 0.6)',
                                },
                            }}
                        />
                        :
                        <TextField
                            select
                            label="Проект"
                            variant='standard'
                            value={boardNameValue || ''}
                            onChange={(e) => setBoardNameValue(e.target.value)}
                            disabled={isMutating}
                        >
                            {boards?.data && boards.data.length > 0 ? (
                                boards.data.map((option) => (
                                    <MenuItem key={option.id} value={option.name}>
                                        {option.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled value="">
                                    Нет доступных проектов
                                </MenuItem>
                            )}
                        </TextField>
                    }

                    <TextField
                        select
                        label="Приоритет"
                        variant="standard"
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
                        variant="standard"
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

                    <Autocomplete
                        disablePortal
                        options={usersForAutocompleate || []}
                        value={assigneeValue}
                        onChange={(e, newValue) => {
                            setAssigneeValue(newValue);
                        }}
                        selectOnFocus={false}
                        getOptionLabel={(option) => option.fullName || option.label || ''}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                        }
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-medium">
                                        {option.fullName
                                            ?.split(' ')
                                            .map(word => word[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-medium">{option.fullName}</div>
                                        <div className="text-sm text-gray-500">{option.email}</div>
                                    </div>
                                </div>
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Исполнитель"
                                variant="standard"
                            />
                        )}
                    />
                </>
                :
                <DrawerProgress />
            }

            <div className='flex flex-row justify-between items-center mt-auto'>
                <Button
                    variant="contained"
                     onClick={() => {
                        navigate(`/board/${boardId}`)
                        onCloseDrawer()
                    }}
                    disabled={isMutating || !boardId}
                >
                    Перейти на доску
                </Button>

                <Button
                    variant="contained"
                    onClick={updateTaskHandler}
                    disabled={isMutating}
                >
                    {isMutating ? 'Сохранение...' : (id == undefined ? 'Создать' : 'Редактировать')}
                </Button>
            </div>
        </div>
    )

}

export default DrawerContent

