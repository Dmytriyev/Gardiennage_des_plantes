import axios from "axios";
import { userService } from "./user.service";

const Axios = axios.create({
    baseURL : "http://localhost:3000"
})

Axios.interceptors.request.use(request => {

    if ( userService.isLogged() ) {
        request.headers.Authorization = `Bearer ${userService.getToken()}`
    }

    return request
})

Axios.interceptors.response.use(response => {
    return response
}, error => {
    if ( error.response.status === 400 ) {
        userService.logout(),
        window.location = "/login"
    }
    else {
        return Promise.reject(error)
    }
})

export default Axios