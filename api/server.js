import express from "express"
import db from './db/db.js'
import userRoutes from "./routes/user.routes.js"
import articleRoutes from './routes/article.route.js';
import commentaryRoutes from './routes/commentary.route.js';
import categoryRoutes from './routes/category.route.js';
import cors from "cors"

// Utilisation du framework express
const app = express()

// L'API traitera des données au format JSON
app.use(express.json())

db()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}))

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`)
})

app.use("/users", userRoutes)
app.use('/category', categoryRoutes);
app.use('/commentary', commentaryRoutes);
app.use('/article', articleRoutes);
