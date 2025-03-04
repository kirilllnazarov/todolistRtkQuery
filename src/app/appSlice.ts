import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { tasksApi } from "../features/todolists/api/tasksApi"
import { todolistsApi } from "../features/todolists/api/todolistsApi"

export type ThemeMode = "dark" | "light"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    error: null as string | null,
    isLoggedIn: false,
  },
  reducers: (create) => ({
    changeTheme: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppError: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return
        }
      })
      .addMatcher(isFulfilled, (state) => {})
      .addMatcher(isRejected, (state) => {})
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,

    selectAppError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
})

export const { changeTheme, setAppError, setIsLoggedIn } = appSlice.actions
export const { selectAppError, selectThemeMode, selectIsLoggedIn } = appSlice.selectors
export const appReducer = appSlice.reducer
