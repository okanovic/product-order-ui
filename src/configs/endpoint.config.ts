// Base URL should be set from environment variables
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const endpointConfig = {
    register: `${baseUrl}/auth/register`,
    login: `${baseUrl}/auth/login`,
    logout: `${baseUrl}/auth/logout`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
    resetPassword: `${baseUrl}/auth/reset-password`,
    refreshToken: `${baseUrl}/auth/refresh-token`,
    products: `${baseUrl}/product/products`,
    createCompanies: `${baseUrl}/companies/create`,
}

export default endpointConfig

/*
export const ROUTES = {
  PRODUCTS: {
    GET_ALL: '/',
    CREATE: '/create',
    BASE: '/products',
    GET_BY_ID: '/product/:id',
    GET_BY_COMPANY: '/company/:companyId',
  },

  AUTH: {
    BASE: '/auth',
    REGISTER: '/register',
    LOGIN: '/login',
  },

  COMPANY: {
    BASE: '/companies',
    CREATE: '/create',
    GET_BY_ID: '/companies/:id',
  },
};

*/
