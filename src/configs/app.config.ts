export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy:
        | 'localStorage'
        | 'sessionStorage'
        | 'cookies'
        | 'cookie'
    enableMock: boolean
    activeNavTranslation: boolean
    tokenConfig: {
        accessTokenExpiry: number
        refreshTokenExpiry: number
        cookieOptions: {
            httpOnly: boolean
            secure: boolean
            sameSite: 'strict' | 'lax' | 'none'
            path: string
        }
    }
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    accessTokenPersistStrategy: 'cookie',
    enableMock: true,
    activeNavTranslation: false,
    tokenConfig: {
        accessTokenExpiry: 15 * 60,
        refreshTokenExpiry: 7 * 24 * 60 * 60,
        cookieOptions: {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        },
    },
}

export default appConfig
