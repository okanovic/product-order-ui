export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    accessToken: string
    refreshToken: string
    user: {
        userId: string
        userName: string
        authority: string[]
        avatar: string
        email: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    name: string
    surname: string
    email: string
    password: string
    company: {
        name: string
        address: string
        city: string
        state: string
        zipCode: string
        country: string
    }
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
}

export type Token = {
    accessToken: string
    refreshToken: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}

export type RefreshTokenResponse = {
    accessToken: string
    refreshToken: string
}

export type UserDetailResponse = {
    id: number
    name: string
    surname: string
    email: string
    createdAt: string
    companies: {
        id: number
        name: string
        isActive: boolean
    }[]
}
