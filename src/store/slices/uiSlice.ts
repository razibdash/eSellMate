import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  sidebarOpen: boolean;
  commandOpen: boolean;
  language: "en" | "bn" | "banglish";
};

const initialState: UiState = {
  sidebarOpen: false,
  commandOpen: false,
  language: "en"
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCommandOpen(state, action: PayloadAction<boolean>) {
      state.commandOpen = action.payload;
    },
    setLanguage(state, action: PayloadAction<UiState["language"]>) {
      state.language = action.payload;
    }
  }
});

export const { setSidebarOpen, toggleSidebar, setCommandOpen, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
