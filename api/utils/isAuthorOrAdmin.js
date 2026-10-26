// Vrai si l'utilisateur connecté (req.user) est l'auteur de la ressource ou un administrateur
const isAuthorOrAdmin = (user, authorId) => user.isAdmin === true || String(authorId) === user.id

export default isAuthorOrAdmin
