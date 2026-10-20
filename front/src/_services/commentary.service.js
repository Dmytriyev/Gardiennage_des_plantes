import Axios from "./caller.service"

let createComment = (credentials, article_id) => {
    return Axios.post(`/commentary/new/${article_id}`, credentials)
}

let getAllComments = () => {
    return Axios.get("/commentary/all")
}

let getOneComment = (id) => {
    return Axios.get(`/commentary/${id}`)
}

let updateComment = (id, credentials) => {
    return Axios.put(`/commentary/${id}`, credentials)
}

let deleteComment = (id) => {
    return Axios.delete(`/commentary/${id}`)
}

export const commentService = {
    createComment, getAllComments, getOneComment, updateComment, deleteComment
}