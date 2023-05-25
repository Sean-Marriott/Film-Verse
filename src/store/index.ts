import { create } from 'zustand'
interface UserState {
    userId: number,
    authToken: string,
    setUserId: (userId: number) => void,
    setAuthToken: (authToken: string) => void,
    removeUserId: () => void,
    removeAuthToken: () => void
}

const useStore = create<UserState>((set) => ({
    userId: parseInt(localStorage.getItem('userId') as string) || -1,
    authToken: localStorage.getItem('authToken') || "",
    setUserId: (userId: number) => set(() => {
        localStorage.setItem('userId', userId.toString())
        return {userId: userId}
    }),
    setAuthToken: (authToken: string) => set(() => {
        localStorage.setItem('authToken', authToken)
        return {authToken: authToken}
    }),
    removeUserId: () => set(() => {
        localStorage.removeItem('userId')
        return {userId: -1}
    }),
    removeAuthToken: () => set(() => {
        localStorage.removeItem('authToken')
        return {authToken: ""}
    })
}))

export const useUserStore = useStore