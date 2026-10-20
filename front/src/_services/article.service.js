import Axios from "./caller.service"

let createArticle = (credentials) => {
    return Axios.post("/article/new", credentials)
}

let getAllArticles = () => {
    return Axios.get("/article/all")
}

let getOneArticle = (id) => {
    return Axios.get(`/article/${id}`)
}

let updateArticle = (id, credentials) => {
    return Axios.put(`/article/${id}`, credentials)
}

let deleteArticle = (id) => {
    return Axios.delete(`/article/${id}`)
}

export const articleService = {
    createArticle, getAllArticles, getOneArticle, updateArticle, deleteArticle
}