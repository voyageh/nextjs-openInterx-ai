import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const store = (set) => ({
  width: '50%',
  user: {},
  changeWidth: (width) => {
    set({ width })
  },
})

export const useUserStore = create(
  persist(store, {
    name: 'openinterx-user',
  })
)
