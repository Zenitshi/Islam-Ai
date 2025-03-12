interface ApiEndpoints {
    keys: {
        update: string;
        get: (provider: string) => string;
    };
    chat: string;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api: ApiEndpoints = {
    keys: {
        update: `${API_BASE_URL}/api/keys`,
        get: (provider: string) => `${API_BASE_URL}/api/keys/${provider}`
    },
    chat: `${API_BASE_URL}/api/chat`
} 