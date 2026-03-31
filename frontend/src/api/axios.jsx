import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - automatically add Authorization header to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle 401 errors (token expired/invalid)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const signup = async (data) => {
    const res = await api.post("/v1/signup", data);

    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data.user));
    return res.data;
};

export const login = async (data) => {
    const res = await api.post("/v1/login", data);
    console.log(res, '::::::::::::::::::::')
    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data.user));
    return res.data;
};

export default api;