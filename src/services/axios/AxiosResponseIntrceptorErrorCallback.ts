import { useSessionUser, useToken } from '@/store/authStore'
import type { AxiosError } from 'axios'
import { apiRefreshToken } from '@/services/AuthService'
import axios from 'axios'

const unauthorizedCode = [401, 419, 440]

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

const AxiosResponseIntrceptorErrorCallback = async (error: AxiosError) => {
    const { response, config } = error
    const { setTokens } = useToken()

    if (response && unauthorizedCode.includes(response.status)) {
        const originalRequest = config

        if (!isRefreshing) {
            isRefreshing = true

            try {
                // Refresh token ile yeni access token al
                const { accessToken, refreshToken } = await apiRefreshToken()

                // Yeni token'ı kaydet
                setTokens(accessToken, refreshToken)

                // Başarısız olan requestleri tekrar dene
                processQueue(null, accessToken)

                // Orijinal requesti yeni token ile tekrar dene
                if (originalRequest) {
                    originalRequest.headers['Authorization'] =
                        `Bearer ${accessToken}`
                    return axios(originalRequest)
                }
            } catch (refreshError) {
                // Refresh token da geçersizse logout yap
                processQueue(refreshError, null)
                setTokens('', '')
                useSessionUser.getState().setUser({})
                useSessionUser.getState().setSessionSignedIn(false)
                // Login sayfasına yönlendir
                window.location.href = '/login'
            } finally {
                isRefreshing = false
            }
        } else {
            // Eğer refresh işlemi devam ediyorsa, requesti kuyruğa ekle
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            })
                .then((token) => {
                    if (originalRequest) {
                        originalRequest.headers['Authorization'] =
                            `Bearer ${token}`
                        return axios(originalRequest)
                    }
                })
                .catch((err) => {
                    return Promise.reject(err)
                })
        }
    }

    return Promise.reject(error)
}

export default AxiosResponseIntrceptorErrorCallback
