import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MediaSummary, MediaType } from "@/types/tmdb";

/** localStorage key the list is persisted under. Bump the suffix if the
 * stored shape ever changes incompatibly. */
export const MY_LIST_STORAGE_KEY = "movieflix:my-list:v1";

export interface MyListItem extends MediaSummary {
  mediaType: Extract<MediaType, "movie" | "tv">;
  addedAt: number;
}

export interface MyListState {
  /** Keyed by `${mediaType}-${id}` for O(1) "is this saved?" lookups from
   * every card on screen without scanning an array. */
  items: Record<string, MyListItem>;
  /** False until `MyListSync` has read localStorage once on mount — lets
   * the My List page distinguish "genuinely empty" from "haven't loaded
   * the saved list yet". */
  hydrated: boolean;
}

export const myListKey = (mediaType: string, id: number | string): string =>
  `${mediaType}-${id}`;

const initialState: MyListState = {
  items: {},
  hydrated: false,
};

export const myListSlice = createSlice({
  name: "myList",
  initialState,
  reducers: {
    hydrateMyList: (state, action: PayloadAction<Record<string, MyListItem>>) => {
      state.items = action.payload;
      state.hydrated = true;
    },
    addToMyList: (state, action: PayloadAction<MyListItem>) => {
      state.items[myListKey(action.payload.mediaType, action.payload.id)] = action.payload;
    },
    removeFromMyList: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    toggleMyList: (state, action: PayloadAction<MyListItem>) => {
      const key = myListKey(action.payload.mediaType, action.payload.id);
      if (state.items[key]) {
        delete state.items[key];
      } else {
        state.items[key] = action.payload;
      }
    },
    clearMyList: (state) => {
      state.items = {};
    },
  },
});

export const { hydrateMyList, addToMyList, removeFromMyList, toggleMyList, clearMyList } =
  myListSlice.actions;

export default myListSlice.reducer;
