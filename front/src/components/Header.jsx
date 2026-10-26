import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { userService } from '../_services/user.service';
import Logo from './Logo';
import { IconClose, IconMenu, IconPlus } from './Icons';

// NavLink donne isActive : on souligne en jaune la page courante
const navLinkClass = ({ isActive }) =>
    `block border-b-2 py-2 font-semibold transition-colors ${isActive ? "border-soleil text-foret" : "border-transparent text-mousse hover:text-foret"}`

const Header = () => {

    const [ menuOpen, setMenuOpen ] = useState(false)

    const logout = () => {
        userService.logout()
        window.location.href = "/"
    }

    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="sticky top-0 z-30 border-b border-black/5 bg-creme/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
                <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
                    <Logo className="h-11 w-11" />
                    <span className="text-lg font-extrabold leading-5 text-foret">Gardiennage<br />des plantes</span>
                </Link>

                {/* Bouton du menu mobile */}
                <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2 text-foret hover:bg-menthe md:hidden" aria-controls="menu-principal" aria-expanded={menuOpen}>
                    <span className="sr-only">{menuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
                    {menuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
                </button>

                <div id="menu-principal" className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-4 pb-4 md:flex md:w-auto md:flex-1 md:flex-row md:items-center md:justify-between md:pb-0 md:pl-10`}>
                    <nav className="flex flex-col md:flex-row md:gap-8" aria-label="Navigation principale">
                        <NavLink to="/" end onClick={closeMenu} className={navLinkClass}>Accueil</NavLink>
                        <NavLink to="/articles/list" onClick={closeMenu} className={navLinkClass}>Annonces</NavLink>
                        <Link to="/#comment-ca-marche" onClick={closeMenu} className={navLinkClass({ isActive: false })}>Comment ça marche&nbsp;?</Link>
                        {userService.isAdmin() && (
                        <NavLink to="/admin/dashboard" onClick={closeMenu} className={navLinkClass}>Admin</NavLink>
                        )}
                    </nav>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        {userService.isLogged() ? (
                            <>
                            <Link to="/articles/new" onClick={closeMenu} className="btn btn-primary"><IconPlus /> Créer une annonce</Link>
                            <button type="button" onClick={logout} className="btn text-mousse hover:text-foret">Déconnexion</button>
                            </>
                        ) : (
                            <>
                            <Link to="/login" onClick={closeMenu} className="btn btn-outline">Connexion</Link>
                            <Link to="/register" onClick={closeMenu} className="btn btn-primary">S'inscrire</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
