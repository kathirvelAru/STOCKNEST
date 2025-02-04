import {create} from "zustand";

export const useWatchlistsDataStore = create((set) => ({
   watchlists: [],
   updateWatchlists : (watchlists) => set({watchlists: watchlists})
}))