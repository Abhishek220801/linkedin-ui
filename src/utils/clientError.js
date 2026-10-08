// import { message } from "antd";
import axios from "axios";
// const NODE_ENV = import.meta.env.VITE_NODE_ENVhttps://9rnxrpg7-5173.inc1.devtunnels.ms/

const clientError = async (error) => {
    if(axios.isAxiosError(error)){
        return error.response?.data?.message
    }
    if(error instanceof Error)
        return error.message
    console.log({error})
    return error.message
}

export default clientError;