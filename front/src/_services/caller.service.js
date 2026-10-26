import axios from "axios";
import { userService } from "./user.service";

const Axios = axios.create({
    baseURL : import.meta.env.VITE_API_URL || "http://localhost:3000"
})

Axios.interceptors.request.use(request => {

    if ( userService.isLogged() ) {
        request.headers.Authorization = `Bearer ${userService.getToken()}`
    }

    return request
})

// 401 = jeton invalide ou expiré : on déconnecte et on renvoie vers la connexion.
// Les autres erreurs (400, 403, 404...) sont transmises à la page qui les affiche.
Axios.interceptors.response.use(response => {
    return response
}, error => {
    if ( error.response?.status === 401 && userService.isLogged() ) {
        userService.logout()
        window.location = "/login"
    }
    return Promise.reject(error)
})

export default Axios
