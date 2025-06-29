// src/services/api.ts
import axios from 'axios';
import { storage } from '../utils/storage';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // If your server uses cookies for auth
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
    const token = storage.get('userToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
