import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
    persist((set) => ({
    user: null,
    isAuthenticated: false,
    authInitialized: false,

    setUser: (user) => 
        set(() => ({
            user,
            isAuthenticated: true,
            authInitialized: true,
        }
    )),
    clearUser: () =>
        set({
            user: null,
            isAuthenticated: false,
            authInitialized: true,
        })
    }),
    {
        "name": "auth-storage",

        partialize: (state) => ({
            user: state.user
        })
    }
))

export default useAuthStore;