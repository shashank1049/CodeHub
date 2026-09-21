
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://codehub-1-4vwb.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;