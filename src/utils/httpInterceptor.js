import axios from "axios"

const httpInterceptor = axios.create({
    baseURL: import.meta.env.VITE_NODE_ENV === "development" ? import.meta.env.VITE_SERVER : import.meta.env.VITE_SERVER_PROD,
    withCredentials: true
})

export default httpInterceptor;