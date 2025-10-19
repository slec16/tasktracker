import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface DrawerState {
    isOpen: boolean
    drawerId: string | null
    boardId: string | null
    refetchState?: boolean
}

const initialState: DrawerState = {
    isOpen: false,
    drawerId: null,
    boardId: null,
    refetchState: false
};

const drawerSlice = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        openDrawer: (state, action: PayloadAction<{
            drawerId: string | null
            boardId: string | null
        }>) => {
            state.isOpen = true
            state.drawerId = action.payload.drawerId
            state.boardId = action.payload.boardId
        },
        closeDrawer: (state) => {
            state.isOpen = false
            state.drawerId = null
            state.boardId = null
        },
        toggleDrawer: (state, action: PayloadAction<{
          drawerId: string | null
            boardId: string | null
        }>) => {
            if (state.isOpen && state.drawerId === action.payload.drawerId) {
                state.isOpen = false
                state.drawerId = null
                state.boardId = null
            } else {
                state.isOpen = true
                state.drawerId = action.payload.drawerId
                state.boardId = action.payload.boardId
            }
        },
        setRefetchTrue: (state) => {
            state.refetchState = true
        },
        setRefetchFalse: (state) => {
            state.refetchState = false
        }

    },
});

export const { openDrawer, closeDrawer, toggleDrawer, setRefetchFalse, setRefetchTrue } = drawerSlice.actions
export default drawerSlice.reducer