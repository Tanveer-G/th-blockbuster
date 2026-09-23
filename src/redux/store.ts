import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./features/homeSlice";
import uiReducer from "./features/uiSlice";
import myListReducer from "./features/myListSlice";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    ui: uiReducer,
    myList: myListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
