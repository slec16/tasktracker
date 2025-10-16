import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import type { ChangeEvent } from 'react'
import type { Theme } from '@mui/material/styles'
import { Button, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { useBoards } from "../hooks/useBoards"
import { useUsers } from '../hooks/useUsers'
import { type Task } from '../api/taskApi'
import { useUpdateTask, useCreateTask } from '../hooks/useTasks'
import DrawerProgress from './DrawerProgress'
import { useAppSelector } from '../hooks/redux'


const DrawerContent = ({ onCloseDrawer, drawerData, onRefresh }: { onCloseDrawer: () => void, drawerData: Task, onRefresh: () => void }) => {

    const { id, title, description, priority, status, assignee, boardName } = drawerData
    const { boardId } = useAppSelector((state) => state.drawer)

    const navigate = useNavigate()
    const { mutate, isPending: isMutating } = useUpdateTask(id)
    const { mutate: createTask } = useCreateTask()

    const { data: boards } = useBoards()
    const { data: users } = useUsers()

    // console.log('render')

    const usersForAutocompleate = useMemo(() =>
        users?.data.map(el => ({
            ...el,
            label: el.fullName
        })) || [],
        [users?.data]
    )

    const [titleValue, setTitleValue] = useState(title)
    const [descriptionValue, setDescriptionValue] = useState(description)
    const [priorityValue, setPriorityValue] = useState(priority)
    const [statusValue, setStatusValue] = useState(status)
    // const [boardNameValue, setBoardNameValue] = useState(boardName)

    const [assigneeValue, setAssigneeValue] = useState<{
        label: string;
        id: number;
        fullName: string;
        email: string;
        description: string;
        avatarUrl: string;
    } | null>(
        usersForAutocompleate?.find(el => el.id === assignee?.id) || null
    )

    const [selectedBoardId, setSelectedBoardId] = useState<string>('')

    useEffect(() => {
        setTitleValue(title)
        setDescriptionValue(description)
        setPriorityValue(priority)
        setStatusValue(status)
        setAssigneeValue(usersForAutocompleate.find(el => el.id === assignee?.id) || null)
        // setBoardNameValue(boardName)
    }, [title, description, priority, status, assignee, boardName, boardId, usersForAutocompleate])

    const priorityOptions = useMemo(() => [
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
    ], [])

    const statusOptions = useMemo(() => [
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
    ], [])

    const updateTaskHandler = useCallback(() => {

        if (id) {
            const updatedTask = {
                title: titleValue,
                description: descriptionValue,
                priority: priorityValue,
                status: statusValue,
                assigneeId: assigneeValue?.id || assignee.id
            }
            mutate(
                {
                    id: id,
                    taskData: updatedTask
                }, {
                    onSuccess: () => {
                        // setOpenSuccessSnackbar(true)
                        onRefresh()
                    }
                }
            )
        } else {
            const newTask = {
                assigneeId: assigneeValue?.id,
                boardId: selectedBoardId,
                description: descriptionValue,
                priority: priorityValue,
                title: titleValue
            }
            createTask(
                {...newTask}
            )
        }

    }, [titleValue, descriptionValue, priorityValue, statusValue, assigneeValue, id, mutate, onRefresh])

    const handleAssigneeChange = useCallback((_: unknown, newValue: typeof assigneeValue) => {
        setAssigneeValue(newValue)
    }, [])
    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.target.value)
    }, [])
    const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDescriptionValue(e.target.value)
    }, [])
    const handlePriorityChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPriorityValue(e.target.value)
    }, [])
    const handleStatusChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setStatusValue(e.target.value)
    }, [])
    const handleBoardChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const boardId = e.target.value
        setSelectedBoardId(boardId)
    }, [])

    const disabledProjectSx = useMemo(() => ({
        '& .MuiInput-underline:before': {
            borderBottomColor: (theme: Theme) =>
                theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.22)',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: (theme: Theme) =>
                theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.5)'
                    : 'rgba(0, 0, 0, 0.42)',
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
        },
        '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: (theme: Theme) =>
                theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(0, 0, 0, 0.8)',
            backgroundColor: 'transparent',
        },
        '& .MuiInputLabel-root.Mui-disabled': {
            color: (theme: Theme) =>
                theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.5)'
                    : 'rgba(0, 0, 0, 0.6)',
        },
    }), [])

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
                        onChange={handleTitleChange}
                        disabled={isMutating}
                    />
                    <TextField
                        label="Описание"
                        variant="standard"
                        multiline
                        minRows={4}
                        maxRows={10}
                        value={descriptionValue}
                        onChange={handleDescriptionChange}
                        disabled={isMutating}
                    />

                    {id !== undefined ?
                        <TextField
                            label="Проект"
                            variant="standard"
                            value={boardName || ''}
                            disabled={true}
                            sx={disabledProjectSx}
                        />
                        :
                        <TextField
                            select
                            label="Проект"
                            variant='standard'
                            value={selectedBoardId}
                            onChange={handleBoardChange}
                            disabled={isMutating}
                        >
                            {boards?.data && boards.data.length > 0 ? (
                                boards.data.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
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
                        onChange={handlePriorityChange}
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
                        onChange={handleStatusChange}
                        disabled={isMutating}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <AssigneeSelect
                        options={usersForAutocompleate}
                        value={assigneeValue}
                        onChange={handleAssigneeChange}
                        disabled={isMutating}
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

export default memo(DrawerContent)


type AssigneeOption = {
    label: string;
    id: number;
    fullName: string;
    email: string;
    description: string;
    avatarUrl: string;
}

type AssigneeValue = AssigneeOption | null

interface AssigneeSelectProps {
    options: AssigneeOption[]
    value: AssigneeValue
    onChange: (event: unknown, newValue: AssigneeValue) => void
    disabled?: boolean
}

const AssigneeSelect = memo((props: AssigneeSelectProps) => {

    const { options, value, onChange, disabled } = props

    return (
        <Autocomplete
            disablePortal
            options={options || []}
            value={value}
            onChange={onChange}
            selectOnFocus={false}
            getOptionLabel={(option) => option.fullName || option.label || ''}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
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
            disabled={disabled}
        />
    )
})

