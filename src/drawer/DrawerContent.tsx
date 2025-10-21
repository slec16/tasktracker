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
import type { Task, EmptyTask } from '../api/taskApi'
import { useUpdateTask, useCreateTask } from '../hooks/useTasks'
import DrawerProgress from './DrawerProgress'
import { useAppSelector } from '../hooks/redux'
import { useAppDispatch } from '../hooks/redux'
import { setRefetchTrue } from '../store/drawerSlice'
import { useMatch } from 'react-router-dom'

type DrawerContentProps = {
    onCloseDrawer: () => void
    drawerData: Task | EmptyTask
    onCreateSuccess?: (id: number, boardId: number) => void
    onCreateError?: () => void
    onUpdateSuccess: () => void
    onUpdateError: () => void
}

const DrawerContent = (props: DrawerContentProps) => {

    const { onCloseDrawer, drawerData, onCreateSuccess, onCreateError, onUpdateSuccess, onUpdateError } = props

    const match = useMatch('/board/:boardId')

    const { id, title, description, priority, status, assignee, boardName } = drawerData
    const { boardId } = useAppSelector((state) => state.drawer)

    const dispatch = useAppDispatch()

    const navigate = useNavigate()
    const { mutate, isPending: isMutating } = useUpdateTask(id as number)
    const { mutate: createTask } = useCreateTask()

    const { data: boards } = useBoards()
    const { data: users } = useUsers()

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

    const [selectedBoardId, setSelectedBoardId] = useState<string>(match?.params.boardId ? match?.params.boardId : '')

    // Состояния для валидации
    const [errors, setErrors] = useState<{
        title?: string
        description?: string
        priority?: string
        status?: string
        assignee?: string
        board?: string
    }>({})

    useEffect(() => {
        setTitleValue(title)
        setDescriptionValue(description)
        setPriorityValue(priority)
        setStatusValue(status)
        setAssigneeValue(usersForAutocompleate.find(el => el.id === assignee?.id) || null)
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

    // Функция валидации полей
    const validateFields = useCallback(() => {
        const newErrors: typeof errors = {}

        if (!titleValue.trim()) {
            newErrors.title = 'Название обязательно'
        }

        if (!descriptionValue.trim()) {
            newErrors.description = 'Описание обязательно'
        }

        if (!priorityValue) {
            newErrors.priority = 'Приоритет обязателен'
        }

        if (!statusValue) {
            newErrors.status = 'Статус обязателен'
        }

        if (!assigneeValue?.id) {
            newErrors.assignee = 'Исполнитель обязателен'
        }

        if (!id && !selectedBoardId) {
            newErrors.board = 'Проект обязателен'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [titleValue, descriptionValue, priorityValue, statusValue, assigneeValue, selectedBoardId, id])

    const updateTaskHandler = useCallback(() => {

        const isValid = validateFields()
        if (!isValid) {
            return
        }

        if (id) {
            const updatedTask = {
                title: titleValue,
                description: descriptionValue,
                priority: priorityValue,
                status: statusValue,
                assigneeId: assigneeValue?.id || assignee.id as number
            }
            mutate(
                {
                    id: id,
                    taskData: updatedTask
                }, {
                onSuccess: () => {
                    onUpdateSuccess()
                    setErrors({})
                    dispatch(setRefetchTrue())
                },
                onError: () => {
                    onUpdateError()
                }
            }
            )
        } else {
            const newTask = {
                assigneeId: assigneeValue?.id as number,
                boardId: Number(selectedBoardId),
                description: descriptionValue,
                priority: priorityValue,
                title: titleValue
            }

            createTask(
                { ...newTask }, {
                onSuccess: (res) => {
                    onCreateSuccess?.(res.data.id, Number(selectedBoardId))
                    setErrors({})
                },
                onError: () => {
                    onCreateError?.()
                }
            })
        }
    }, [
        titleValue, descriptionValue, priorityValue, statusValue,
        assigneeValue, id, mutate, createTask, selectedBoardId,
        onUpdateSuccess, onUpdateError, onCreateSuccess,
        onCreateError, validateFields
    ])

    const handleAssigneeChange = useCallback((_: unknown, newValue: typeof assigneeValue) => {
        setAssigneeValue(newValue)
        if (errors.assignee && newValue?.id) {
            setErrors(prev => ({ ...prev, assignee: undefined }))
        }
    }, [errors.assignee])

    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.target.value)
        if (errors.title && e.target.value.trim()) {
            setErrors(prev => ({ ...prev, title: undefined }))
        }
    }, [errors.title])

    const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDescriptionValue(e.target.value)
        if (errors.description && e.target.value.trim()) {
            setErrors(prev => ({ ...prev, description: undefined }))
        }
    }, [errors.description])

    const handlePriorityChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPriorityValue(e.target.value)
        if (errors.priority && e.target.value) {
            setErrors(prev => ({ ...prev, priority: undefined }))
        }
    }, [errors.priority])

    const handleStatusChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setStatusValue(e.target.value)
        if (errors.status && e.target.value) {
            setErrors(prev => ({ ...prev, status: undefined }))
        }
    }, [errors.status])

    const handleBoardChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const boardId = e.target.value
        setSelectedBoardId(boardId)
        if (errors.board && boardId) {
            setErrors(prev => ({ ...prev, board: undefined }))
        }
    }, [errors.board])

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
        <div className='flex flex-col w-full px-5 pt-3 pb-10 gap-y-4 h-full relative'>

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
                        error={!!errors.title}
                        helperText={errors.title}
                        required
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
                        error={!!errors.description}
                        helperText={errors.description}
                        required
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
                            error={!!errors.board}
                            helperText={errors.board}
                            required
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
                        error={!!errors.priority}
                        helperText={errors.priority}
                        required
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
                        error={!!errors.status}
                        helperText={errors.status}
                        required
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
                        error={errors.assignee}
                        required
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
                    }}
                    disabled={isMutating || !boardId ||  match?.params.boardId == boardId}
                >
                    Перейти на доску
                </Button>

                <Button
                    variant="contained"
                    onClick={updateTaskHandler}
                    // disabled={!canSave}
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
    error?: string
    required?: boolean
}

const AssigneeSelect = memo((props: AssigneeSelectProps) => {

    const { options, value, onChange, disabled, error, required } = props

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
                    label={`Исполнитель${required ? ' *' : ''}`}
                    variant="standard"
                    error={!!error}
                    helperText={error}
                />
            )}
            disabled={disabled}
        />
    )
})

