import cookiesStorage from '@/utils/cookiesStorage'
import appConfig from '@/configs/app.config'
import { TOKEN_NAME_IN_STORAGE } from '@/constants/api.constant'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/@types/auth'

type Session = {
    signedIn: boolean
}

type AuthState = {
    session: Session
    user: User
}

type AuthAction = {
    setSessionSignedIn: (payload: boolean) => void
    setUser: (payload: User) => void
}

const getPersistStorage = () => {
    if (appConfig.accessTokenPersistStrategy === 'localStorage') {
        return localStorage
    }

    if (appConfig.accessTokenPersistStrategy === 'sessionStorage') {
        return sessionStorage
    }

    return cookiesStorage
}

const initialState: AuthState = {
    session: {
        signedIn: false,
    },
    user: {
        avatar: '',
        userName: '',
        email: '',
        authority: [],
    },
}

export const useSessionUser = create<AuthState & AuthAction>()(
    persist(
        (set) => ({
            ...initialState,
            setSessionSignedIn: (payload) =>
                set((state) => ({
                    session: {
                        ...state.session,
                        signedIn: payload,
                    },
                })),
            setUser: (payload) =>
                set((state) => ({
                    user: {
                        ...state.user,
                        ...payload,
                    },
                })),
        }),
        { name: 'sessionUser', storage: createJSONStorage(() => localStorage) },
    ),
)

export const useToken = () => {
    const setToken = (token: string) => {
        // Access Token için
        document.cookie = `access_token=${token}; ${getCookieOptions()}`
    }

    const setRefreshToken = (token: string) => {
        // Refresh Token için
        document.cookie = `refresh_token=${token}; ${getCookieOptions()}`
    }

    const getCookieOptions = () => {
        const { cookieOptions } = appConfig.tokenConfig
        return Object.entries(cookieOptions)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ')
    }

    return {
        setToken,
        setRefreshToken,
        // Token'ları JavaScript ile okuyamayız (httpOnly)
        // Backend'den gelen response'da token'lar otomatik olarak cookie'lere kaydedilir
    }
}
