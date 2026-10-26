import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

// Fonctions réutilisables par les tests du front.
// Après chaque test : page vidée, membre déconnecté, simulations annulées.
afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.restoreAllMocks()
})

// Jeton JWT factice : le front décode le jeton mais ne vérifie jamais sa signature (c'est le rôle de l'API)
const base64url = (obj) => btoa(JSON.stringify(obj)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")

export const fakeToken = (payload) => `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url(payload)}.signature`

const inOneHour = () => Math.floor(Date.now() / 1000) + 3600

// Simule un membre connecté (jeton valable 1 h)
export const loginAs = ({ id = "membre-1", isAdmin = false, exp = inOneHour() } = {}) => {
    localStorage.setItem("token", fakeToken({ id, email: `${id}@test.fr`, isAdmin, exp }))
}
