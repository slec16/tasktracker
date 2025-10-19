import Drawer from '@mui/material/Drawer'
import Snackbar from '@mui/material/Snackbar'
import { useState, useCallback } from 'react'
import { useTask } from '../hooks/useTasks'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { closeDrawer, openDrawer } from '../store/drawerSlice'
import DrawerContent from './DrawerContent'
import DrawerProgress from './DrawerProgress'

const TaskDrawer = () => {

    const { isOpen, drawerId } = useAppSelector((state) => state.drawer)
    const dispatch = useAppDispatch()

    const { data: task, isLoading, refetch } = useTask(Number(drawerId))

    console.log(task?.data)

    const handleClose = () => {
        // ??? при закрытии id сбрасывает и drawer показывет перед закрытием форму создания задачи
        dispatch(closeDrawer())
    }

    const [openCreateSuccess, setOpenCreateSuccess] = useState(false)
    const [openCreateError, setOpenCreateError] = useState(false)
    const [openEditSuccess, setOpenEditSuccess] = useState(false)
    const [openEditError, setOpenEditError] = useState(false)



    const handleCreateSuccess = useCallback((newTaskId: number, boardId: number) => {
        setOpenCreateSuccess(true)
        dispatch(openDrawer({ drawerId: String(newTaskId), boardId: String(boardId) }))
    }, [dispatch])

    const handleCreateError = useCallback(() => {
        setOpenCreateError(true)
    }, [])

    const handleEditSuccess = () => {
        setOpenEditSuccess(true)
        refetch()
    }

    const handleEditError = () => {
        setOpenEditError(true)
    }

    const emptyTask = {
        id: undefined,
        title: '',
        description: '',
        priority: '',
        status: '',
        assignee: {
            id: undefined,
            fullName: '',
            email: '',
            avatarUrl: ''
        },
        boardName: ''
    }

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
            {isLoading ?
                <div className='px-2 pt-5'>
                    <DrawerProgress />
                </div>
                :
                <>
                    <DrawerContent
                        onCloseDrawer={handleClose}
                        drawerData={task ? task.data : emptyTask}
                        onCreateSuccess={handleCreateSuccess}
                        onCreateError={handleCreateError}
                        onUpdateSuccess={handleEditSuccess}
                        onUpdateError={handleEditError}
                    />

                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={openCreateSuccess}
                        autoHideDuration={3000}
                        onClose={() => setOpenCreateSuccess(false)}
                        message="Задача успешно создана"
                        sx={{
                            '& .MuiSnackbarContent-root': {
                                backgroundColor: '#4caf50',
                                color: '#fff'
                            }
                        }}
                    />

                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={openCreateError}
                        autoHideDuration={3000}
                        onClose={() => setOpenCreateError(false)}
                        message="Не удалось создать задачу"
                        sx={{
                            '& .MuiSnackbarContent-root': {
                                backgroundColor: '#d21616',
                                color: '#fff'
                            }
                        }}
                    />
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={openEditSuccess}
                        autoHideDuration={3000}
                        onClose={() => setOpenEditSuccess(false)}
                        message="Задача успешно изменена"
                        sx={{
                            '& .MuiSnackbarContent-root': {
                                backgroundColor: '#4caf50',
                                color: '#fff'
                            }
                        }}
                    />
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={openEditError}
                        autoHideDuration={3000}
                        onClose={() => setOpenEditError(false)}
                        message="Не удалось изменить задачу"
                        sx={{
                            '& .MuiSnackbarContent-root': {
                                backgroundColor: '#d21616',
                                color: '#fff'
                            }
                        }}
                    />
                </>
            }
        </Drawer >
    )
}

export default TaskDrawer