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
    CV_DETAILS: (cvId: string) => `/cvs/${cvId}/details`,
    CV_SKILLS: (cvId: string) => `/cvs/${cvId}/skills`,
    CV_PROJECTS: (cvId: string) => `/cvs/${cvId}/projects`,
    CV_PREVIEW: (cvId: string) => `/cvs/${cvId}/preview`,
    // Вкладки на сайдбаре
    SKILLS: '/skills',
    LANGUAGES: '/languages',
    CVS: '/cvs',
}