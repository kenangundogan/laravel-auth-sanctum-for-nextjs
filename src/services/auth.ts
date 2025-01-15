// src/services/auth.ts
import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Response interceptor ekleyelim
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // Token expire olduysa (401 hatası)
        if (error.response?.status === 401) {
            localStorage.removeItem("token"); // Token'ı temizle
            window.location.href = "/login"; // Login sayfasına yönlendir
        }
        return Promise.reject(error);
    },
);

// Token'ı request interceptor ile ekleyelim
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
    message: string;
}

interface User {
    name: string;
    email: string;
}

export const AuthService = {
    login: async (credentials: LoginCredentials) => {
        try {
            const response = await api.post<LoginResponse>(
                "/api/login",
                credentials,
            );
            localStorage.setItem("token", response.data.token);
            return response.data;
        } catch (error) {
            console.error("Login hatası:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem("token");

            // Token yoksa direkt temizle ve çık
            if (!token) {
                localStorage.removeItem("token");
                return;
            }

            // Token varsa API'ye logout isteği at
            await api.post("/api/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Başarılı logout sonrası token'ı temizle
            localStorage.removeItem("token");
        } catch (error) {
            // Hata olsa bile token'ı temizle
            localStorage.removeItem("token");
            console.error("Logout hatası:", error);
            // Hatayı yukarı fırlat
            throw error;
        }
    },

    getUser: async (): Promise<User> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token bulunamadı");
            }

            const response = await api.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Kullanıcı bilgileri alınamadı:", error);
            throw error;
        }
    },

    // Token'ın geçerli olup olmadığını kontrol et
    checkToken: async (): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return false;

            await api.get("/api/user");
            return true;
        } catch (error) {
            return false;
        }
    },
};
