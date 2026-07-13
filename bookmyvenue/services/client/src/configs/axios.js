import axios from 'axios';
import keycloak from './keycloak';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use(
  async (config) => {
    try {
      if (keycloak.authenticated) {
        await keycloak.updateToken(30);
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
    } catch (error) {
      console.error('Failed to refresh token', error);
      keycloak.login();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;