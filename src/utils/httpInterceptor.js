import axios from "axios"

const httpInterceptor = axios.create({
    baseURL: import.meta.env.VITE_SERVER,
    withCredentials: true
})

export default httpInterceptor;