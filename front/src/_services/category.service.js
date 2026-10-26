import Axios from "./caller.service"

let createCategory = (credentials) => {
    return Axios.post(`/category/new`, credentials)
}

let getAllCategories = () => {
    return Axios.get("/category/all")
}

let getOneCategory = (id) => {
    return Axios.get(`/category/${id}`)
}

let updateCategory = (id, credentials) => {
    return Axios.put(`/category/${id}`, credentials)
}

let deleteCategory = (id) => {
    return Axios.delete(`/category/${id}`)
}

export const categoryService = {
    createCategory, getAllCategories, getOneCategory, updateCategory, deleteCategory
}