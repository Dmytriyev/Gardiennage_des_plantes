import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, within, fireEvent } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { AxiosError } from "axios"
import { timeAgo } from "../src/_helpers/timeAgo"
import { errorMessage } from "../src/_helpers/errorMessage"
import { annonceTypes } from "../src/_helpers/annonceTypes"
import AuthGuard from "../src/_helpers/AuthGuard"
import AdminGuard from "../src/_helpers/AdminGuard"
import Axios from "../src/_services/caller.service"
import { userService } from "../src/_services/user.service"
import { articleService } from "../src/_services/article.service"
import Header from "../src/components/Header"
import AnnonceCard from "../src/components/AnnonceCard"
import Home from "../src/pages/public/Home"
import OneArticle from "../src/pages/articles/OneArticle"
import { loginAs } from "./outils"

// Tests du front. Lancer une seule catégorie : npx vitest run -t "Unitaires"

describe("Unitaires", () => {
    const ago = (seconds) => new Date(Date.now() - seconds * 1000)

    describe("timeAgo", () => {
        it("moins d'une minute → « à l'instant »", () => {
            expect(timeAgo(ago(30))).toBe("à l'instant")
        })

        // Intl place une espace insécable entre le nombre et l'unité (typographie française)
        it("formate les minutes, les heures et les jours en français", () => {
            expect(timeAgo(ago(5 * 60))).toBe("il y a 5\u00a0min")
            expect(timeAgo(ago(2 * 3600))).toBe("il y a 2\u00a0h")
            expect(timeAgo(ago(3 * 86400))).toBe("il y a 3\u00a0j")
        })

        it("dit « hier » pour un jour", () => {
            expect(timeAgo(ago(26 * 3600))).toBe("hier")
        })

        it("accepte une date au format texte (createdAt de l'API)", () => {
            expect(timeAgo(ago(2 * 3600).toISOString())).toBe("il y a 2\u00a0h")
        })
    })

    describe("errorMessage", () => {
        it("API injoignable → message explicite", () => {
            expect(errorMessage(new Error("Network Error"))).toBe("Serveur injoignable, réessayez plus tard")
        })

        it("affiche le message renvoyé par l'API", () => {
            expect(errorMessage({ response: { data: { message: "Annonce introuvable" } } })).toBe("Annonce introuvable")
        })

        it("message générique si l'API n'en donne pas", () => {
            expect(errorMessage({ response: { status: 500, data: "" } })).toBe("Une erreur est survenue")
        })

        it("ne plante pas sans erreur", () => {
            expect(errorMessage(null)).toBe("Serveur injoignable, réessayez plus tard")
        })
    })

    describe("annonceTypes", () => {
        it("définit exactement les 3 types d'annonce du cahier des charges", () => {
            expect(Object.keys(annonceTypes)).toEqual(["don", "demande", "offre"])
            expect(annonceTypes.don.label).toBe("Don")
            expect(annonceTypes.demande.label).toBe("Demande de gardiennage")
            expect(annonceTypes.offre.label).toBe("Offre de gardiennage")
        })

        it("chaque type a ses classes de badge, de fond et de bordure", () => {
            for (const type of Object.values(annonceTypes)) {
                expect(type.badge).toMatch(/^bg-\S+ text-white$/)
                expect(type.soft).toMatch(/^bg-\S+ text-\S+$/)
                expect(type.border).toMatch(/^border-\S+$/)
            }
        })

        it("chaque type a une couleur distincte (code couleur de la charte)", () => {
            const badges = Object.values(annonceTypes).map(type => type.badge)
            expect(new Set(badges).size).toBe(3)
        })
    })

    describe("userService", () => {
        it("visiteur : ni connecté, ni admin, ni auteur", () => {
            expect(userService.isLogged()).toBe(false)
            expect(userService.isAdmin()).toBe(false)
            expect(userService.isAuthorOrAdmin("membre-1")).toBe(false)
        })

        it("membre connecté avec un jeton valide", () => {
            loginAs({ id: "membre-1" })
            expect(userService.isLogged()).toBe(true)
            expect(userService.isAdmin()).toBe(false)
        })

        it("un jeton expiré ne compte plus comme connecté", () => {
            loginAs({ id: "admin-1", isAdmin: true, exp: Math.floor(Date.now() / 1000) - 60 })
            expect(userService.isLogged()).toBe(false)
            expect(userService.isAdmin()).toBe(false)
            expect(userService.isAuthorOrAdmin("autre")).toBe(false)
        })

        it("un jeton illisible ne compte pas comme connecté", () => {
            vi.spyOn(console, "log").mockImplementation(() => {})
            localStorage.setItem("token", "pas-un-jwt")
            expect(userService.isLogged()).toBe(false)
        })

        it("isAuthorOrAdmin : l'auteur oui, un autre membre non", () => {
            loginAs({ id: "membre-1" })
            expect(userService.isAuthorOrAdmin("membre-1")).toBe(true)
            expect(userService.isAuthorOrAdmin("membre-2")).toBe(false)
            expect(userService.isAuthorOrAdmin(undefined)).toBe(false)
        })

        it("isAuthorOrAdmin : un admin peut modérer tout le monde", () => {
            loginAs({ id: "admin-1", isAdmin: true })
            expect(userService.isAdmin()).toBe(true)
            expect(userService.isAuthorOrAdmin("membre-2")).toBe(true)
        })

        it("logout supprime le jeton", () => {
            loginAs()
            userService.logout()
            expect(localStorage.getItem("token")).toBeNull()
            expect(userService.isLogged()).toBe(false)
        })
    })
})

describe("Intégration", () => {
    const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>)

    describe("Page d'accueil", () => {
        it("affiche l'accroche et les deux boutons principaux", () => {
            renderHome()
            expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/^Partagez, donnez, faites grandir la vie\s!$/)
            expect(screen.getAllByRole("link", { name: /Voir les annonces/ })[0]).toHaveAttribute("href", "/articles/list")
            expect(screen.getAllByRole("link", { name: /Créer une annonce/ })[0]).toHaveAttribute("href", "/articles/new")
        })

        it("présente les 3 façons de participer avec leur badge", () => {
            renderHome()
            const section = screen.getByRole("heading", { name: "Trois façons de participer" }).closest("section")
            for (const titre of ["Donner une plante", "Faire garder vos plantes", "Garder des plantes"]) {
                expect(within(section).getByRole("heading", { name: titre })).toBeInTheDocument()
            }
            expect(within(section).getByText("Demande de gardiennage")).toBeInTheDocument()
        })

        it("affiche 4 annonces récentes", () => {
            renderHome()
            const section = screen.getByRole("heading", { name: "Dernières annonces" }).closest("section")
            expect(within(section).getAllByRole("heading", { level: 3 })).toHaveLength(4)
        })

        it("explique le fonctionnement en 3 étapes numérotées", () => {
            renderHome()
            const section = document.getElementById("comment-ca-marche")
            expect(within(section).getAllByRole("listitem")).toHaveLength(3)
        })

        it("propose l'inscription à un visiteur", () => {
            renderHome()
            expect(screen.getByRole("link", { name: "S'inscrire gratuitement" })).toHaveAttribute("href", "/register")
        })

        it("propose de créer une annonce à un membre connecté", () => {
            loginAs()
            renderHome()
            expect(screen.queryByRole("link", { name: "S'inscrire gratuitement" })).not.toBeInTheDocument()
            expect(screen.getAllByRole("link", { name: /Créer une annonce/ })).toHaveLength(2)
        })

        it("toutes les images ont un texte alternatif", () => {
            renderHome()
            for (const img of document.querySelectorAll("img")) {
                expect(img.hasAttribute("alt")).toBe(true)
            }
        })
    })

    const renderHeader = (path = "/") => render(<MemoryRouter initialEntries={[path]}><Header /></MemoryRouter>)

    describe("En-tête", () => {
        it("visiteur : Connexion et S'inscrire", () => {
            renderHeader()
            expect(screen.getByRole("link", { name: "Connexion" })).toHaveAttribute("href", "/login")
            expect(screen.getByRole("link", { name: "S'inscrire" })).toHaveAttribute("href", "/register")
            expect(screen.queryByRole("button", { name: "Déconnexion" })).not.toBeInTheDocument()
        })

        it("membre : Créer une annonce et Déconnexion, pas de lien Admin", () => {
            loginAs()
            renderHeader()
            expect(screen.getByRole("link", { name: /Créer une annonce/ })).toHaveAttribute("href", "/articles/new")
            expect(screen.getByRole("button", { name: "Déconnexion" })).toBeInTheDocument()
            expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument()
        })

        it("admin : lien vers le tableau de bord", () => {
            loginAs({ isAdmin: true })
            renderHeader()
            expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/admin/dashboard")
        })

        it("souligne la page courante", () => {
            renderHeader("/articles/list")
            expect(screen.getByRole("link", { name: "Annonces" })).toHaveAttribute("aria-current", "page")
            expect(screen.getByRole("link", { name: "Accueil" })).not.toHaveAttribute("aria-current")
        })

        it("le menu mobile s'ouvre et se ferme (aria-expanded)", () => {
            renderHeader()
            const bouton = screen.getByRole("button", { name: "Ouvrir le menu" })
            expect(bouton).toHaveAttribute("aria-expanded", "false")
            fireEvent.click(bouton)
            expect(screen.getByRole("button", { name: "Fermer le menu" })).toHaveAttribute("aria-expanded", "true")
        })
    })

    const renderAt = (path) => render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/" element={<p>Accueil</p>} />
                <Route path="/login" element={<p>Page de connexion</p>} />
                <Route path="/membre" element={<AuthGuard><p>Espace membre</p></AuthGuard>} />
                <Route path="/admin" element={<AdminGuard><p>Espace admin</p></AdminGuard>} />
            </Routes>
        </MemoryRouter>
    )

    describe("AuthGuard", () => {
        it("renvoie un visiteur vers la connexion", () => {
            renderAt("/membre")
            expect(screen.getByText("Page de connexion")).toBeInTheDocument()
        })

        it("renvoie vers la connexion si le jeton a expiré", () => {
            loginAs({ exp: Math.floor(Date.now() / 1000) - 60 })
            renderAt("/membre")
            expect(screen.getByText("Page de connexion")).toBeInTheDocument()
        })

        it("laisse passer un membre connecté", () => {
            loginAs()
            renderAt("/membre")
            expect(screen.getByText("Espace membre")).toBeInTheDocument()
        })
    })

    describe("AdminGuard", () => {
        it("renvoie un visiteur vers la connexion", () => {
            renderAt("/admin")
            expect(screen.getByText("Page de connexion")).toBeInTheDocument()
        })

        it("renvoie un membre vers l'accueil", () => {
            loginAs()
            renderAt("/admin")
            expect(screen.getByText("Accueil")).toBeInTheDocument()
        })

        it("laisse passer un admin", () => {
            loginAs({ isAdmin: true })
            renderAt("/admin")
            expect(screen.getByText("Espace admin")).toBeInTheDocument()
        })
    })

    const article = {
        _id: "annonce-1",
        title: "Petit olivier à donner",
        content: "Olivier en pot, très bien entretenu.",
        createdAt: "2026-10-20T10:00:00.000Z",
        author: { _id: "alice", username: "alice" },
        categories: [{ _id: "cat-1", name: "Arbres" }],
        commentaries: [
            { _id: "com-1", content: "Je suis intéressé", createdAt: "2026-10-21T10:00:00.000Z", author: { _id: "bob", username: "bob" } },
            { _id: "com-2", content: "Encore disponible ?", createdAt: "2026-10-22T10:00:00.000Z", author: null }
        ]
    }

    const renderArticle = (data = article) => {
        vi.spyOn(articleService, "getOneArticle").mockResolvedValue({ data })
        return render(
            <MemoryRouter initialEntries={["/articles/one/annonce-1"]}>
                <Routes>
                    <Route path="/articles/one/:id" element={<OneArticle />} />
                </Routes>
            </MemoryRouter>
        )
    }

    describe("Détail d'une annonce", () => {
        it("affiche l'annonce, sa catégorie et son auteur", async () => {
            renderArticle()
            expect(await screen.findByRole("heading", { name: "Petit olivier à donner" })).toBeInTheDocument()
            expect(screen.getByText("Arbres")).toBeInTheDocument()
            expect(screen.getByText(/Publiée par alice le 20\/10\/2026/)).toBeInTheDocument()
            expect(articleService.getOneArticle).toHaveBeenCalledWith("annonce-1")
        })

        it("affiche les commentaires, même si leur auteur a été supprimé", async () => {
            renderArticle()
            expect(await screen.findByRole("heading", { name: "Commentaires (2)" })).toBeInTheDocument()
            expect(screen.getByText("Je suis intéressé")).toBeInTheDocument()
            expect(screen.getByText(/Écrit par un membre supprimé/)).toBeInTheDocument()
        })

        it("visiteur : invité à se connecter, aucun bouton Modifier", async () => {
            renderArticle()
            await screen.findByRole("heading", { name: "Petit olivier à donner" })
            expect(screen.getByRole("link", { name: "Connectez-vous" })).toHaveAttribute("href", "/login")
            expect(screen.queryByRole("link", { name: "Modifier" })).not.toBeInTheDocument()
            expect(screen.queryByRole("button", { name: "Supprimer" })).not.toBeInTheDocument()
        })

        it("autre membre : peut commenter, mais pas modifier l'annonce", async () => {
            loginAs({ id: "carol" })
            renderArticle()
            expect(await screen.findByRole("link", { name: "Laisser un commentaire" })).toHaveAttribute("href", "/comments/new/annonce-1")
            expect(screen.queryByRole("button", { name: "Supprimer" })).not.toBeInTheDocument()
        })

        it("auteur de l'annonce : Modifier et Supprimer", async () => {
            loginAs({ id: "alice" })
            renderArticle()
            expect(await screen.findByRole("button", { name: "Supprimer" })).toBeInTheDocument()
            expect(screen.getAllByRole("link", { name: "Modifier" })[0]).toHaveAttribute("href", "/articles/update/annonce-1")
        })

        it("auteur d'un commentaire : peut modifier le sien uniquement", async () => {
            loginAs({ id: "bob" })
            renderArticle()
            const liens = await screen.findAllByRole("link", { name: "Modifier" })
            expect(liens).toHaveLength(1)
            expect(liens[0]).toHaveAttribute("href", "/comments/update/com-1")
        })

        it("affiche un message si l'API ne répond pas", async () => {
            vi.spyOn(articleService, "getOneArticle").mockRejectedValue(new Error("Network Error"))
            render(
                <MemoryRouter initialEntries={["/articles/one/annonce-1"]}>
                    <Routes><Route path="/articles/one/:id" element={<OneArticle />} /></Routes>
                </MemoryRouter>
            )
            expect(await screen.findByText(/^Erreur\s:\sServeur injoignable, réessayez plus tard$/)).toBeInTheDocument()
        })
    })
})

describe("Sécurité", () => {
    const XSS = '<img src="x" onerror="window.piraté=true"><script>window.piraté=true</script>'

    describe("Protection XSS : le contenu des membres est affiché comme du texte", () => {
        it("AnnonceCard n'interprète pas le HTML du titre ni de la description", () => {
            render(
                <MemoryRouter>
                    <AnnonceCard to="/" annonce={{
                        _id: "1", type: "don", title: XSS, content: XSS, city: XSS, distance: "1 km",
                        image: "/images/annonce-olivier.jpg", author: { username: "<b>pirate</b>" },
                        commentsCount: 0, createdAt: new Date()
                    }} />
                </MemoryRouter>
            )
            expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(XSS)
            expect(document.querySelectorAll("script")).toHaveLength(0)
            expect(document.querySelector('img[src="x"]')).toBeNull()
            expect(document.querySelector("b")).toBeNull()
            expect(window.piraté).toBeUndefined()
        })

        it("la page d'une annonce n'interprète pas le HTML des commentaires", async () => {
            vi.spyOn(articleService, "getOneArticle").mockResolvedValue({ data: {
                _id: "a1", title: XSS, content: XSS, createdAt: new Date().toISOString(),
                author: { _id: "u1", username: XSS }, categories: [{ _id: "c1", name: XSS }],
                commentaries: [{ _id: "m1", content: XSS, createdAt: new Date().toISOString(), author: { _id: "u2", username: XSS } }]
            } })
            render(
                <MemoryRouter initialEntries={["/articles/one/a1"]}>
                    <Routes><Route path="/articles/one/:id" element={<OneArticle />} /></Routes>
                </MemoryRouter>
            )
            await screen.findByRole("heading", { level: 1 })
            expect(document.querySelectorAll("script")).toHaveLength(0)
            expect(document.querySelector('img[src="x"]')).toBeNull()
            expect(window.piraté).toBeUndefined()
        })
    })

    // Remplace le réseau : on contrôle ce que « répond » l'API (puis on le rétablit)
    const adapterOrigine = Axios.defaults.adapter
    afterEach(() => { Axios.defaults.adapter = adapterOrigine })

    const respond = (status) => {
        Axios.defaults.adapter = async (config) => {
            if ( status < 400 ) {
                return { data: { authorization: config.headers.Authorization ?? null }, status, statusText: "OK", headers: {}, config }
            }
            throw new AxiosError("Erreur", "ERR_BAD_REQUEST", config, null, { status, data: {}, headers: {}, config })
        }
    }

    describe("Envoi du jeton à l'API", () => {
        beforeEach(() => respond(200))

        it("n'envoie rien pour un visiteur", async () => {
            const res = await Axios.get("/article/all")
            expect(res.data.authorization).toBeNull()
        })

        it("envoie « Bearer <jeton> » pour un membre connecté", async () => {
            loginAs()
            const res = await Axios.get("/article/all")
            expect(res.data.authorization).toBe(`Bearer ${localStorage.getItem("token")}`)
        })

        it("n'envoie pas un jeton expiré", async () => {
            loginAs({ exp: Math.floor(Date.now() / 1000) - 60 })
            const res = await Axios.get("/article/all")
            expect(res.data.authorization).toBeNull()
        })
    })

    describe("Réponses d'erreur", () => {
        beforeEach(() => {
            // jsdom ne sait pas changer de page : on ignore son avertissement de navigation
            vi.spyOn(console, "error").mockImplementation(() => {})
        })

        it("401 pour un membre connecté (jeton refusé) → déconnexion", async () => {
            loginAs()
            respond(401)
            await expect(Axios.get("/users/all")).rejects.toThrow()
            expect(localStorage.getItem("token")).toBeNull()
        })

        it("401 à la connexion (mauvais mot de passe) → l'erreur est transmise au formulaire", async () => {
            respond(401)
            await expect(Axios.post("/users/login", {})).rejects.toMatchObject({ response: { status: 401 } })
        })

        it("403 ou 400 → l'utilisateur reste connecté", async () => {
            loginAs()
            for (const status of [400, 403]) {
                respond(status)
                await expect(Axios.put("/article/1", {})).rejects.toMatchObject({ response: { status } })
                expect(localStorage.getItem("token")).not.toBeNull()
            }
        })
    })
})
