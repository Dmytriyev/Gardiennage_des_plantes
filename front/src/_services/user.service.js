import Axios from "./caller.service";
import { jwtDecode } from "jwt-decode"

let login = (credentials) => {
    return Axios.post("/users/login", credentials)
}

let register = (credentials) => {
    return Axios.post("/users/register", credentials)
}

let getAllUsers = () => {
    return Axios.get("/users/all")
}

let getOneUser = (id) => {
    return Axios.get(`/users/${id}`)
}

let updateOne = (id, credentials) => {
    return Axios.put(`/users/${id}`, credentials)
}

let deleteUser = (id) => {
    return Axios.delete(`/users/${id}`)
}

let saveToken = (token) => {
    localStorage.setItem("token", token)
}

let getToken = () => {
    return localStorage.getItem("token")
}

let logout = () => {
    localStorage.removeItem("token")
}

let isLogged = () => {
    let token = localStorage.getItem("token")
    return !!token
}

let getUserFromToken = () => {
    const token = localStorage.getItem("token")

    if ( !token ) {
        return null
    }
    try {
        return jwtDecode(token)
    } catch (error) {
        console.log("Token invalide", error)
        return null
    }
}

let isAdmin = () => {
    const user = getUserFromToken()
    return user?.isAdmin === true
}

export const userService = {
    login, register, getAllUsers, getOneUser, updateOne, deleteUser, saveToken, getToken, logout, isLogged, isAdmin
}