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
    const { setToken, getToken } = useToken()

    if (response && unauthorizedCode.includes(response.status)) {
        const originalRequest = config

        console.log('Token expired, attempting refresh...')

        if (!isRefreshing) {
            isRefreshing = true

            try {
                // Refresh token ile yeni token al
                const { accessToken, refreshToken } = await apiRefreshToken()
                console.log('New tokens received:', {
                    accessToken,
                    refreshToken,
                })

                // Yeni token'ları kaydet
                setToken(accessToken)

                // Başarısız olan requestleri tekrar dene
                processQueue(null, accessToken)

                // Orijinal requesti yeni token ile tekrar dene
                if (originalRequest) {
                    originalRequest.headers['Authorization'] =
                        `Bearer ${accessToken}`
                    return axios(originalRequest)
                }
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError)
                processQueue(refreshError, null)
                // Token'ları temizle ve logout yap
                setToken('')
                useSessionUser.getState().setUser({})
                useSessionUser.getState().setSessionSignedIn(false)
                window.location.href = '/login'
            } finally {
                isRefreshing = false
            }
        } else {
            console.log('Refresh already in progress, queueing request...')
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
