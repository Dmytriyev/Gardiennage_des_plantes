import app from "./app.js"
import db from './db/db.js'

// Sans clé secrète, aucun jeton ne peut être signé : on refuse de démarrer
if ( !process.env.SECRET_KEY ) {
    console.error("SECRET_KEY manquante dans le fichier .env")
    process.exit(1)
}

db()

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`)
})
