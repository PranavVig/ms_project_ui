import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {

    const auth = localStorage.getItem("auth");

    if (auth) {
        config.headers.Authorization = `Basic ${auth}`;
    }

    return config;
});

export default api;