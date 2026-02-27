export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET: '/auth/reset',
    NEWPASSWORD: '/auth/new_password',
    PROFILE: (userId: string) => `/users/${userId}/profile`,
    SKILLS: '/skills',
    LANGUAGES: '/languages',
}