import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

import { AuthResponse } from "../types/response/AuthResponse";

interface ApiConfig extends AxiosRequestConfig {
    baseURL: string;
}

export const API_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL || "http://localhost:5500";

// export const API_URL =
//     process.env.NODE_ENV === "production"
//         ? `${process.env.NEXT_PUBLIC_APP_SERVER_URL}` 
//         : "http://localhost:5500/api";


const createApi = (config: ApiConfig): AxiosInstance => {
    return axios.create(config)
  }
  
export const $api = createApi({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config;
});

$api.interceptors.response.use((config) => {
    return config; 
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/api/auth/refresh`, {withCredentials: true});
            if (response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
                return $api.request(originalRequest);
            }  
        } catch (e) {
            console.log(`Не авторизован. Ошибка ${e}`);
        } 
    }
    return error;
});

export default $api;