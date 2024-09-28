import { create } from 'zustand'

const store = (set) => ({
  drag: '',
  setDrag: (drag) => set({ drag }),
})

export const useUniversalStore = create(store)
