import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Genre, ImageConfig } from "@/types/tmdb";

export const DEFAULT_BACKGROUND_IMAGE = "/images/backGroundImage.jpg";

export interface HomeState {
  imgUrl: ImageConfig;
  genresMovie: Genre[];
  genresTv: Genre[];
  /** Full-bleed page background — defaults to the site background and is
   * swapped for the selected movie/show's backdrop on its details page. */
  backgroundImage: string;
}

const initialState: HomeState = {
  imgUrl: {
    backdrop: "",
    poster: "",
    profile: "",
  },
  genresMovie: [],
  genresTv: [],
  backgroundImage: DEFAULT_BACKGROUND_IMAGE,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    getApiConfiguration: (state, action: PayloadAction<ImageConfig>) => {
      state.imgUrl = action.payload;
    },
    getGenresMovie: (state, action: PayloadAction<Genre[]>) => {
      state.genresMovie = action.payload;
    },
    getGenresTv: (state, action: PayloadAction<Genre[]>) => {
      state.genresTv = action.payload;
    },
    setBackgroundImage: (state, action: PayloadAction<string | undefined>) => {
      state.backgroundImage = action.payload || DEFAULT_BACKGROUND_IMAGE;
    },
  },
});

export const {
  getApiConfiguration,
  getGenresMovie,
  getGenresTv,
  setBackgroundImage,
} = homeSlice.actions;

export default homeSlice.reducer;
