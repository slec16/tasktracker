import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DrawerState {
  isOpen: boolean;
  drawerId: string | null;
}

const initialState: DrawerState = {
  isOpen: false,
  drawerId: null,
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<string | null>) => {
      state.isOpen = true;
      state.drawerId = action.payload;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.drawerId = null;
    },
    toggleDrawer: (state, action: PayloadAction<string>) => {
      if (state.isOpen && state.drawerId === action.payload) {
        state.isOpen = false;
        state.drawerId = null;
      } else {
        state.isOpen = true;
        state.drawerId = action.payload;
      }
    },
  },
});

export const { openDrawer, closeDrawer, toggleDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;