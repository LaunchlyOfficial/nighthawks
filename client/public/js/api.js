// API utility functions
const API_BASE_URL = 'http://localhost:3001/api';

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const csrfToken = localStorage.getItem('csrfToken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-CSRF-Token': csrfToken
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            },
            credentials: 'include'
        });

        if (response.status === 403) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
} 