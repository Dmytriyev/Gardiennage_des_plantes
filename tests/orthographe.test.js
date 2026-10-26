// cspell:disable — les règles ci-dessous contiennent volontairement les fautes qu'elles recherchent
// Tests d'orthographe et de typographie française.
// cspell (npm run test:orthographe) vérifie l'orthographe mot par mot ;
// ce fichier vérifie ce qu'un dictionnaire ne voit pas : typographie, accents, vocabulaire.
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { globSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const ROOT = fileURLToPath(new URL("..", import.meta.url))
const read = (file) => readFileSync(ROOT + file, "utf-8")
// Fichiers du site uniquement : ni dépendances, ni dossiers de tests (leurs textes ne sont pas affichés)
const files = (patterns) => globSync(patterns, { cwd: ROOT })
    .filter(file => !file.split(/[\\/]/).some(part => part === "node_modules" || part === "tests"))

const FRONT = files(["front/src/**/*.js", "front/src/**/*.jsx"])
const API = files(["api/**/*.js"])
const DOCS = ["README.md", ...files(["Document/*.md"])]

// Textes visibles par l'utilisateur : chaînes de caractères et texte JSX, hors commentaires
const userTexts = (file) => {
    const texts = []
    read(file).split("\n").forEach((line, index) => {
        const code = line.trim()
        if ( /^(\/\/|\/\*|\*|\{\/\*)/.test(code) ) return

        const candidates = []
        // Ligne de texte JSX seule (paragraphe sur plusieurs lignes)
        if ( file.endsWith(".jsx") && !/[<>{}=();"`]/.test(code) ) candidates.push(code)
        for (const match of line.matchAll(/"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`|>([^<>{}]+)(?=[<{])|\}([^<>{}]+)(?=<)/g)) {
            candidates.push(match.slice(1).find(text => text !== undefined))
        }

        for (const text of candidates) {
            // ${...} dans un gabarit est du code, pas du texte
            const clean = text.replace(/\$\{[^}]*\}/g, " ")
            // On ne garde que les phrases (au moins deux mots)
            if ( /[a-zà-ÿ]{2,}\s+[a-zà-ÿ]{2,}/i.test(clean) ) texts.push({ where: `${file}:${index + 1}`, text: clean })
        }
    })
    return texts
}

const SITE_TEXTS = [...FRONT, ...API].flatMap(userTexts)

const check = (texts, regex) => texts.filter(({ text }) => regex.test(text)).map(({ where, text }) => `${where} → « ${text.trim()} »`)

describe("Typographie française des textes du site", () => {
    it("espace insécable (et non espace simple) avant ? ! : ;", () => {
        assert.deepEqual(check(SITE_TEXTS, / [?!:;](?=[\s"'`<{]|$)/), [])
    })

    it("pas de ? ou ! collé au mot", () => {
        assert.deepEqual(check(SITE_TEXTS, /[a-zà-ÿ][?!](?=[\s"'`<{]|$)/i), [])
    })

    it("espace insécable à l'intérieur des guillemets « »", () => {
        assert.deepEqual(check(SITE_TEXTS, /«(?!\\u00a0|\u00a0|&nbsp;)|(?<!\\u00a0|\u00a0|&nbsp;)»/), [])
    })

    it("espace insécable avant % (« 100 % »)", () => {
        // (?<!\\u00a) : « 100\\u00a0% » est correct ; (?=…) : ignore les classes Tailwind comme « inset-x-[16.66%] »
        assert.deepEqual(check(SITE_TEXTS, /(?<!\\u00a)\d ?%(?=[\s"'`<]|$)/), [])
    })
})

describe("Fautes courantes", () => {
    const FAUTES = [
        [/\bÊtes vous\b/, "Êtes-vous"],
        [/\bEtes\b/, "Êtes"],
        [/\bsur de vouloir\b/, "sûr de vouloir"],
        [/\bà bien été\b/, "a bien été"],
        [/\b[Dd]econnexion\b/, "Déconnexion"],
        [/\bEcri(re|t|te)\b/, "Écrire / Écrit (accent sur la majuscule)"],
        [/\b[Ee]tat\b/, "état"],
        [/\breessay/i, "réessayer"]
    ]

    for (const [regex, correction] of FAUTES) {
        it(`aucune occurrence de ${regex} → « ${correction} »`, () => {
            const found = [...FRONT, ...API, ...DOCS].flatMap(file =>
                read(file).split("\n").flatMap((line, i) => regex.test(line) ? [`${file}:${i + 1}`] : []))
            assert.deepEqual(found, [])
        })
    }
})

describe("Vocabulaire du site", () => {
    it("on parle d'« annonce », jamais d'« article » dans l'interface", () => {
        assert.deepEqual(check(SITE_TEXTS, /\b(cet|un|nouvel|des|les|l'|d')\s?articles?\b/i), [])
    })

    it("« e-mail » plutôt que « Email »", () => {
        assert.deepEqual(check(SITE_TEXTS, /\bEmail\b/), [])
    })

    it("« jeton » plutôt que « token » dans les messages", () => {
        assert.deepEqual(check(SITE_TEXTS, /\b[Tt]oken\b/), [])
    })
})

describe("Messages de l'API", () => {
    const messages = API.flatMap(file =>
        [...read(file).matchAll(/message:\s*(["`])((?:[^"`\\]|\\.)*)\1/g)].map(m => ({ where: file, text: m[2] })))

    it("l'API renvoie des messages", () => {
        assert.ok(messages.length > 30, `${messages.length} messages trouvés`)
    })

    it("tous les messages sont en français", () => {
        assert.deepEqual(check(messages, /\b(doesn't|exists?|error|server|request|deleted|not found|invalid|missing|has been)\b/i), [])
    })

    it("tous les messages commencent par une majuscule", () => {
        assert.deepEqual(check(messages, /^[a-zà-ÿ]/), [])
    })
})

describe("Langue des pages", () => {
    it("la page HTML est déclarée en français", () => {
        assert.match(read("front/index.html"), /<html lang="fr">/)
    })
})
