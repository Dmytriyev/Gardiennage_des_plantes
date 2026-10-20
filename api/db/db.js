import { connect } from "mongoose";

function db() {
    connect(process.env.DB_URI)
        .then(() => console.log("Connexion à la base de données établie"))
        .catch((error) => console.error(error))
}

export default db