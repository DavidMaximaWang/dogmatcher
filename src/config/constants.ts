export const API_LIMITS = {
    MAX_ZIP_CODES: 100,
    DEFAULT_PAGE_SIZE: 24,
} as const;

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL,
    ENDPOINTS: {
        DOGS_SEARCH: '/dogs/search',
        DOGS: '/dogs',
        BREEDS: '/dogs/breeds',
        LOCATIONS: '/locations',
    }
} as const;
