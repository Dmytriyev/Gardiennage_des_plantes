import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="bg-foret text-white/80">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[2fr_1fr_1fr]">
                <div>
                    <Link to="/" className="inline-flex items-center gap-3">
                        <span className="rounded-2xl bg-creme p-1.5"><Logo className="h-9 w-9" /></span>
                        <span className="text-lg font-extrabold leading-5 text-white">Gardiennage<br />des plantes</span>
                    </Link>
                    <p className="mt-4 max-w-sm">Moins de gaspillage, plus de verdure et plus de lien entre voisins.</p>
                    <p className="mt-4 inline-block -rotate-2 font-hand text-2xl text-soleil">Des plantes et des gens qui se soutiennent&nbsp;!</p>
                </div>
                <div>
                    <h2 className="font-bold text-white">Le site</h2>
                    <ul className="mt-4 space-y-2">
                        <li><Link to="/" className="hover:text-soleil">Accueil</Link></li>
                        <li><Link to="/articles/list" className="hover:text-soleil">Annonces</Link></li>
                        <li><Link to="/#comment-ca-marche" className="hover:text-soleil">Comment ça marche&nbsp;?</Link></li>
                    </ul>
                </div>
                <div>
                    <h2 className="font-bold text-white">Mon compte</h2>
                    <ul className="mt-4 space-y-2">
                        <li><Link to="/login" className="hover:text-soleil">Connexion</Link></li>
                        <li><Link to="/register" className="hover:text-soleil">Inscription</Link></li>
                        <li><Link to="/articles/new" className="hover:text-soleil">Créer une annonce</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10">
                <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-white/70">© {new Date().getFullYear()} Gardiennage des plantes · Fait avec soin, entre voisins.</p>
            </div>
        </footer>
    );
};

export default Footer;
