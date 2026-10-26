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

// Connecté = jeton présent, lisible et non expiré
let isLogged = () => {
    const user = getUserFromToken()
    return !!user && ( !user.exp || user.exp * 1000 > Date.now() )
}

let getUserFromToken = () => {
    const token = localStorage.getItem("token")

    if ( !token ) {
        return null
    }
    try {
        return jwtDecode(token)
    } catch (error) {
        console.log("Jeton invalide", error)
        return null
    }
}

let isAdmin = () => {
    return isLogged() && getUserFromToken().isAdmin === true
}

// Pour n'afficher « Modifier » et « Supprimer » qu'à l'auteur ou à un admin
let isAuthorOrAdmin = (authorId) => {
    if ( !isLogged() ) {
        return false
    }
    const user = getUserFromToken()
    return user.isAdmin === true || user.id === authorId
}

export const userService = {
    login, register, getAllUsers, getOneUser, updateOne, deleteUser, saveToken, getToken, logout, isLogged, isAdmin, getUserFromToken, isAuthorOrAdmin
}