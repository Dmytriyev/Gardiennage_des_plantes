// À placer après le middleware auth : réserve la route aux administrateurs
const admin = (req, res, next) => {
    if ( !req.user?.isAdmin ) {
        return res.status(403).json({ message: "Accès réservé aux administrateurs" })
    }
    next()
}

export default admin
