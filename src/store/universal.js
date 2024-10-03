import { create } from 'zustand'

const store = (set) => ({
  drag: '',
  selectedVideos: [],
  isNew: false,
  setDrag: (drag) => set({ drag }),
  setSelectedVideos: (selectedVideos, isNew = false) => {
    set({ selectedVideos, isNew })
  },
})

export const useUniversalStore = create(store)
