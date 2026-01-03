import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor (optional, but good for handling 401s globally if needed)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Logic for 401 (e.g., redirect to login) is often better handled in Context or components
            // allowing Context to clear state.
        }
        return Promise.reject(error);
    }
);

export default api;
