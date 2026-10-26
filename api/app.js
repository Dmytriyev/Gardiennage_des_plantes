import express from "express"
import cors from "cors"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"
import userRoutes from "./routes/user.routes.js"
import articleRoutes from './routes/article.route.js';
import commentaryRoutes from './routes/commentary.route.js';
import categoryRoutes from './routes/category.route.js';

// Application Express sans connexion ni écoute : server.js la démarre, les tests l'importent
const app = express()

// En-têtes HTTP de sécurité (supprime aussi « X-Powered-By: Express »)
app.use(helmet())

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}))

// L'API traitera des données au format JSON
app.use(express.json())

// 5 tentatives de connexion ratées par tranche de 15 minutes et par adresse IP
app.use("/users/login", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    message: { message: "Trop de tentatives de connexion, réessayez dans 15 minutes" }
}))

app.use("/users", userRoutes)
app.use('/category', categoryRoutes);
app.use('/commentary', commentaryRoutes);
app.use('/article', articleRoutes);

// Route inconnue
app.use((req, res) => {
    res.status(404).json({ message: "Route introuvable" })
})

// Erreur non gérée (ex. JSON mal formé) : jamais de trace technique dans la réponse.
// Express reconnaît un gestionnaire d'erreurs à ses 4 paramètres, d'où « next » inutilisé.
app.use((error, req, res, next) => {
    if ( error.type === "entity.parse.failed" ) {
        return res.status(400).json({ message: "Le corps de la requête n'est pas un JSON valide" })
    }
    if ( error.type === "entity.too.large" ) {
        return res.status(413).json({ message: "Requête trop volumineuse" })
    }
    if ( error.status >= 400 && error.status < 500 ) {
        return res.status(error.status).json({ message: "Requête invalide" })
    }
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
})

export default app
