export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET: '/auth/reset',
    NEWPASSWORD: '/auth/new_password',
    PROFILE: (userId: string) => `/users/${userId}/profile`,
    SKILLS: (userId: string) => `/users/${userId}/skills`,
    LANGUAGES: (userId: string) => `/users/${userId}/languages`,
}