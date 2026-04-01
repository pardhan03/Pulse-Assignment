import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

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

export const signup = (data) => {
    return api.post("/v1/auth/signup", data);
}

export const login = async (data) => {
    return api.post("/v1/auth/login", data);
};

export const getAllUsers = () => {
    return api.get("v1/users");
};

export const getUsreStats = () => {
    return api.get('/v1/users/stats/')
}

export const updateUserRole = (id, role) => {
    return api.patch(`/v1/users/${id}/role`, { role })
}

export const getAllVideos = () => {
    return api.get("v1/video");
};

export const uploadVideo = (formData, onUploadProgress) => {
    return api.post('/v1/video/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
    })
}

export const editVideo = (id, data) => {
    return api.patch(`/v1/video/${id}`, data)
}

export const deleteVideo = (id) => {
    return api.delete(`/v1/video/${id}`)
}

export default api;