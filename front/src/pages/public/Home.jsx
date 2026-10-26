import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { userService } from '../../_services/user.service';
import { annonceTypes } from '../../_helpers/annonceTypes';
import AnnonceCard from '../../components/AnnonceCard';
import { IconArrowRight, IconCheck, IconGift, IconHeart, IconLuggage, IconPlus } from '../../components/Icons';

const HOUR = 3600 * 1000

// Données d'exemple pour la maquette.
// À remplacer par articleService.getAllArticles() quand le modèle Article
// aura les champs type, city et image.
const demoAnnonces = [
    {
        _id: "demo-1",
        type: "don",
        title: "Fleurs vivaces pour votre jardin",
        content: "Je donne de jolies fleurs vivaces (gerberas, hortensias) qui ont bien poussé dans mon jardin. À venir chercher sur place.",
        city: "Paris 18e",
        distance: "2 km",
        image: "/images/annonce-fleurs.jpg",
        author: { username: "Camille" },
        commentsCount: 12,
        createdAt: new Date(Date.now() - 2 * HOUR)
    },
    {
        _id: "demo-2",
        type: "demande",
        title: "Recherche gardiennage pour 2 semaines",
        content: "Je pars deux semaines en vacances. Je cherche quelqu'un pour arroser mes plantes d'intérieur et de balcon.",
        city: "Saint-Denis",
        distance: "4 km",
        image: "/images/annonce-pot-jaune.jpg",
        author: { username: "Karim" },
        commentsCount: 5,
        createdAt: new Date(Date.now() - 5 * HOUR)
    },
    {
        _id: "demo-3",
        type: "don",
        title: "Petit olivier à donner",
        content: "Je donne un petit olivier en pot, très bien entretenu. Idéal pour un balcon ou un petit jardin.",
        city: "Aubervilliers",
        distance: "6 km",
        image: "/images/annonce-olivier.jpg",
        author: { username: "Julien" },
        commentsCount: 8,
        createdAt: new Date(Date.now() - 8 * HOUR)
    },
    {
        _id: "demo-4",
        type: "offre",
        title: "Je garde vos plantes pendant vos vacances",
        content: "Passionnée de jardinage, je propose de garder vos plantes pendant vos vacances ou vos déplacements.",
        city: "Montreuil",
        distance: "5 km",
        image: "/images/annonce-balcon.jpg",
        author: { username: "Martine" },
        commentsCount: 3,
        createdAt: new Date(Date.now() - 26 * HOUR)
    }
]

const ways = [
    { type: "don", icon: IconGift, title: "Donner une plante", text: "Offrez gratuitement les fleurs et petits arbres dont vous n'avez plus besoin." },
    { type: "demande", icon: IconLuggage, title: "Faire garder vos plantes", text: "Vous partez en vacances\u00a0? Trouvez un voisin de confiance pour les arroser." },
    { type: "offre", icon: IconHeart, title: "Garder des plantes", text: "Proposez votre aide à vos voisins et partagez votre main verte." }
]

const steps = [
    { title: "Inscrivez-vous", text: "Créez votre compte gratuitement, en une minute." },
    { title: "Publiez ou parcourez", text: "Déposez une annonce ou découvrez celles de vos voisins." },
    { title: "Échangez", text: "Discutez dans les commentaires, puis convenez d'un rendez-vous." }
]

const avantages = [ "100\u00a0% gratuit", "Entre voisins", "Sans inscription pour consulter" ]

// Décors de la bannière finale
const Sun = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
        <circle cx="50" cy="50" r="20" className="fill-soleil" />
        {[ 0, 45, 90, 135, 180, 225, 270, 315 ].map(angle => (
            <line key={angle} x1="50" y1="20" x2="50" y2="8" strokeWidth="5" strokeLinecap="round" className="stroke-soleil" transform={`rotate(${angle} 50 50)`} />
        ))}
    </svg>
)

const Leaves = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
        <path d="M50 95C50 60 30 40 5 35c0 30 20 55 45 60Z" className="fill-pousse" />
        <path d="M50 95C50 55 65 25 95 15c5 40-15 70-45 80Z" className="fill-feuille" />
    </svg>
)

const Home = () => {

    const { hash } = useLocation()

    // Lien « Comment ça marche ? » depuis une autre page : on descend jusqu'à la section
    useEffect(() => {
        if ( hash ) {
            document.querySelector(hash)?.scrollIntoView()
        }
    }, [hash])

    return (
        <>
            {/* 1. Bannière d'accueil */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-soleil-clair blur-3xl" aria-hidden="true" />

                <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-12 pt-12 md:grid-cols-2 md:pt-20">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-menthe px-4 py-1.5 text-sm font-bold text-feuille">🌱 Ensemble pour un monde plus vert</p>
                        <h1 className="mt-5 text-4xl font-extrabold leading-tight text-foret sm:text-5xl lg:text-6xl">
                            Partagez, donnez, faites grandir{" "}
                            <span className="relative isolate whitespace-nowrap">
                                <span className="absolute inset-x-0 bottom-1 -z-10 h-1/3 -rotate-1 rounded-full bg-soleil" aria-hidden="true" />
                                la vie&nbsp;!
                            </span>
                        </h1>
                        <p className="mt-5 max-w-lg text-lg text-mousse">
                            Donnez les plantes dont vous n'avez plus besoin, faites garder les vôtres pendant vos absences
                            ou proposez votre aide. Simple, gratuit et près de chez vous.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/articles/list" className="btn btn-primary btn-lg">Voir les annonces <IconArrowRight /></Link>
                            <Link to="/articles/new" className="btn btn-outline btn-lg"><IconPlus /> Créer une annonce</Link>
                        </div>
                        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-mousse">
                            {avantages.map(avantage => (
                                <li key={avantage} className="flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-feuille" /> {avantage}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative mx-auto w-full max-w-md">
                        <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-pousse/30" aria-hidden="true" />
                        <img src="/images/hero-partage.jpg" alt="Des mains qui se passent des plantes en pot" className="relative aspect-[4/5] w-full rounded-[2.5rem] rounded-tr-[7rem] object-cover shadow-2xl shadow-foret/20" />
                        <p className="absolute -bottom-6 -left-2 max-w-[15rem] -rotate-3 rounded-2xl bg-white px-5 py-3 font-hand text-2xl leading-tight text-foret shadow-lg sm:-left-10">
                            Une plante bien gardée, c'est une vie qui continue&nbsp;! <IconHeart className="inline h-5 w-5 text-agrume" />
                        </p>
                    </div>
                </div>

                <svg className="block h-12 w-full text-menthe md:h-20" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 48C240 88 480 8 720 32s480 40 720 0v48H0Z" fill="currentColor" />
                </svg>
            </section>

            {/* 2. Les 3 types d'annonce, avec leur code couleur */}
            <section className="bg-menthe">
                <div className="mx-auto max-w-6xl px-4 pb-20 pt-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-extrabold text-foret sm:text-4xl">Trois façons de participer</h2>
                        <p className="mt-3 text-lg text-mousse">Chacun peut aider, à sa manière. Chaque type d'annonce a sa couleur&nbsp;: repérez-le en un coup d'œil.</p>
                    </div>
                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {ways.map(({ type, icon: Icon, title, text }) => (
                            <article key={type} className={`rounded-3xl border-t-4 bg-white p-7 shadow-sm ${annonceTypes[type].border}`}>
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${annonceTypes[type].soft}`}>
                                    <Icon className="h-7 w-7" />
                                </div>
                                <h3 className="mt-5 text-xl font-extrabold text-encre">{title}</h3>
                                <p className="mt-2 text-mousse">{text}</p>
                                <span className={`mt-5 inline-block rounded-full px-3 py-1 text-xs font-bold ${annonceTypes[type].badge}`}>{annonceTypes[type].label}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Dernières annonces */}
            <section className="mx-auto max-w-6xl px-4 py-20">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-foret sm:text-4xl">Dernières annonces</h2>
                        <p className="mt-2 text-mousse">Près de chez vous, publiées par vos voisins.</p>
                    </div>
                    <Link to="/articles/list" className="inline-flex items-center gap-1.5 font-bold text-feuille hover:text-foret">
                        Voir toutes les annonces <IconArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {demoAnnonces.map(annonce => (
                        <AnnonceCard key={annonce._id} annonce={annonce} to="/articles/list" />
                    ))}
                </div>
            </section>

            {/* 4. Comment ça marche ? */}
            <section id="comment-ca-marche" className="scroll-mt-20 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-20">
                    <h2 className="text-center text-3xl font-extrabold text-foret sm:text-4xl">Comment ça marche&nbsp;?</h2>
                    <div className="relative mt-12">
                        <div className="absolute inset-x-[16.66%] top-7 hidden border-t-2 border-dashed border-pousse md:block" aria-hidden="true" />
                        <ol className="relative grid gap-10 md:grid-cols-3">
                            {steps.map((step, index) => (
                                <li key={step.title} className="text-center">
                                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-soleil text-2xl font-extrabold text-foret ring-8 ring-white">{index + 1}</span>
                                    <h3 className="mt-5 text-xl font-extrabold text-encre">{step.title}</h3>
                                    <p className="mx-auto mt-2 max-w-xs text-mousse">{step.text}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            {/* 5. Appel à l'action */}
            <section className="relative overflow-hidden bg-linear-to-b from-ciel to-menthe">
                <Sun className="absolute -right-8 top-6 h-28 w-28 sm:right-12 sm:h-36 sm:w-36" />
                <Leaves className="absolute -bottom-3 -left-4 h-28 w-28 sm:left-10 sm:h-36 sm:w-36" />

                <div className="relative mx-auto max-w-2xl px-4 py-20 text-center">
                    <p className="inline-block -rotate-2 font-hand text-3xl text-agrume">Rejoignez notre communauté&nbsp;!</p>
                    <h2 className="mt-2 text-3xl font-extrabold text-foret sm:text-4xl">Prêt à faire la différence&nbsp;?</h2>
                    <p className="mt-4 text-lg text-mousse">Inscrivez-vous gratuitement pour donner, faire garder ou garder des plantes près de chez vous.</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        {userService.isLogged() ? (
                            <Link to="/articles/new" className="btn btn-primary btn-lg"><IconPlus /> Créer une annonce</Link>
                        ) : (
                            <Link to="/register" className="btn btn-primary btn-lg">S'inscrire gratuitement</Link>
                        )}
                        <Link to="/articles/list" className="btn btn-outline btn-lg">Voir les annonces</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
