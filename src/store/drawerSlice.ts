import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface DrawerState {
    isOpen: boolean
    drawerId: string | null
    boardId: string | null
}

const initialState: DrawerState = {
    isOpen: false,
    drawerId: null,
    boardId: null,
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

    },
});

export const { openDrawer, closeDrawer, toggleDrawer } = drawerSlice.actions
export default drawerSlice.reducer