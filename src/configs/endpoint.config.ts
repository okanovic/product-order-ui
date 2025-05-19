// Base URL should be set from environment variables
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const endpointConfig = {
    register: `${baseUrl}/auth/register`,
    login: `${baseUrl}/auth/login`,
    logout: `${baseUrl}/auth/logout`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
    resetPassword: `${baseUrl}/auth/reset-password`,
    refreshToken: `${baseUrl}/auth/refresh-token`,
    userDetail: `${baseUrl}/auth/user-detail`,
    products: `${baseUrl}/product/products`,
    createCompanies: `${baseUrl}/companies/create`,
}

export default endpointConfig
