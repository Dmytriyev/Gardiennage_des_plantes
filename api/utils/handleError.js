// Réponse d'erreur commune à tous les contrôleurs :
// le détail technique reste dans les logs du serveur, jamais dans la réponse
const handleError = (res, error) => {
    if ( error.name === "CastError" ) {
        return res.status(400).json({ message: "Identifiant invalide" })
    }
    if ( error.name === "ValidationError" ) {
        return res.status(400).json({ message: "Données invalides" })
    }
    if ( error.code === 11000 ) {
        return res.status(409).json({ message: "Cette valeur est déjà utilisée" })
    }
    console.error(error)
    return res.status(500).json({ message: "Erreur serveur" })
}

export default handleError
