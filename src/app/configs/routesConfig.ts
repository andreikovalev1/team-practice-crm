export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET: '/auth/reset',
    NEWPASSWORD: '/auth/new_password',
    PROFILE: (userId: string) => `/users/${userId}/profile`,
    USERSKILLS: (userId: string) => `/users/${userId}/skills`,
    USERLANGUAGES: (userId: string) => `/users/${userId}/languages`,
    USERCVS: (userId: string) => `/users/${userId}/cvs`,
    // Внутренние табы конкретного CV:
    CV_DETAILS: (userId: string, cvId: string) => `/users/${userId}/cvs/${cvId}`,
    CV_SKILLS: (userId: string, cvId: string) => `/users/${userId}/cvs/${cvId}/skills`,
    CV_PROJECTS: (userId: string, cvId: string) => `/users/${userId}/cvs/${cvId}/projects`,
    CV_PREVIEW: (userId: string, cvId: string) => `/users/${userId}/cvs/${cvId}/preview`,
    // Вкладки на сайдбаре
    SKILLS: '/skills',
    LANGUAGES: '/languages',
    CVS: '/cvs',
}