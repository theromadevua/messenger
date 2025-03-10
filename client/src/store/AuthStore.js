import { flow, makeAutoObservable, reaction } from 'mobx';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

class AuthStore {
    accessToken = localStorage.getItem('accessToken') || null;
    refreshToken = localStorage.getItem('refreshToken') || null;
    isAuthenticated = false;
    user = {};
    refreshInterval = null;
    errorMessage = null;

    constructor() {
        makeAutoObservable(this);
        this.checkToken();
        this.setupRefreshInterval();

        reaction(
            () => this.isAuthenticated,
            (isAuthenticated) => {
                if (isAuthenticated) {
                    this.setupRefreshInterval();
                } else {
                    this.clearRefreshInterval();
                }
            }
        );
    }

    setError(message) {
        this.errorMessage = message;
        console.error(message);
    }

    async checkToken() {
        if (this.accessToken) {
            try {
                const decoded = jwtDecode(this.accessToken);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    await this.refreshTokens();
                } else {
                    const storedUser = localStorage.getItem('user');
                    this.user = storedUser ? JSON.parse(storedUser) : {};
                    this.isAuthenticated = true;
                }
            } catch (error) {
                this.setError('Failed to decode token: ' + error.message);
                this.logout();
            }
        } else if (this.refreshToken) {
            await this.refreshTokens();
        } else {
            this.logout();
        }
    }

    setupRefreshInterval() {
        if (this.isAuthenticated && !this.refreshInterval) {
            this.refreshInterval = setInterval(() => {
                this.refreshTokens().catch((error) => {
                    this.setError('Failed to refresh tokens: ' + error.message);
                });
            }, 10 * 60 * 1000); // 10 minutes
        }
    }

    clearRefreshInterval() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    async refreshTokens() {
        try {
            const response = await api.get('/refresh');
            this.setTokens(response.data.accessToken, response.data.refreshToken);
            this.isAuthenticated = true;
            this.user = response.data.user;
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data.accessToken
        } catch (error) {
            this.setError('Failed to refresh tokens: ' + (error.response?.data?.message || error.message));
            this.logout();
        }
    }

    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    async login(email, password) {
        try {
            const response = await api.post('/login', { email, password });
            this.setTokens(response.data.accessToken, response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.reload();
        } catch (error) {
            this.setError('Login failed: ' + (error.response?.data?.message || error.message));
        }
    }

    async registration(email, username, password) {
        try {
            const response = await api.post('/registration', { email, username, password });
            this.setTokens(response.data.accessToken, response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.reload();
        } catch (error) {
            this.setError('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    }

    async logout() {
        try {
            await api.get('/logout');
        } catch (error) {
            console.warn('Logout request failed: ' + error.message);
        } finally {
            this.accessToken = null;
            this.refreshToken = null;
            this.user = {};
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            this.isAuthenticated = false;
            this.clearRefreshInterval();
        }
    }

    async changeProfile(data) {
        try {
            const response = await api.post('/changeProfile', data);
            this.user = response.data;
            localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error) {
            this.setError('Profile update failed: ' + (error.response?.data?.message || error.message));
        }
    }
}

export default new AuthStore();
