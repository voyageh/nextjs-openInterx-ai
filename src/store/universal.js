import { create } from 'zustand'

const store = (set) => ({
  drag: '',
  selectedVideos: [],
  isNew: false,
  setDrag: (drag) => set({ drag }),
  setSelectedVideos: (selectedVideos) => {
    set({ selectedVideos })
  },
})

export const useUniversalStore = create(store)
