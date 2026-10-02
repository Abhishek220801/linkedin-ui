import { create } from "zustand"

const useCredentialsStore = create((set) => ({
    credentials: {username: ""},
    setEmail: (email) => 
        set((state) => ({
            ...state.credentials,
            email
        }
    )),
    clearCredentials: () =>
        set({
            credentials: {
                email: ""
            }
        })
}))

export default useCredentialsStore;