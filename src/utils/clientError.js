// import { message } from "antd";
import axios from "axios";
const NODE_ENV = import.meta.env.VITE_NODE_ENV

const clientError = async (error) => {
    if(axios.isAxiosError(error)){
        return NODE_ENV === "development" ? error.response?.data?.message : "Network error, please try again after some time"
    }
    if(error instanceof Error)
        return error.message
    console.log({error})
    return error.message
}

export default clientError;