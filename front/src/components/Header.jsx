import React, { useEffect } from 'react';
import { userService } from '../_services/user.service';
import { Link } from 'react-router-dom';
import "./components.css"
import { initFlowbite } from 'flowbite';
import logo from "../assets/Javascript-park.png"

const Header = () => {

    const logout = () => {
        userService.logout()
        window.location.href = "/"
    }

    useEffect(() => {
        initFlowbite()
    })

    return (
        // <div>
        //     <h1>Menu</h1>
        //     <ul>
        //         <li><a href="">Accueil</a></li>
        //         { !userService.isLogged() && (
        //             <>
        //             <li><Link to="/login">Connexion</Link></li>
        //             <li><Link to="/register">Inscription</Link></li>
        //             </>
        //         ) }
        //         {userService.isLogged() && (
        //             <li className='logout_button' onClick={logout}>Déconnexion</li>
        //         )}
        //         {userService.isAdmin() && (
        //         <li><Link to="/admin/dashboard"></Link>Menu admin</li>
        //         )}
        //     </ul>
        // </div>
        <header>
            <nav className="bg-neutral-primary w-full z-20 top-0 start-0 border-default">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logo} className="h-10" alt="Flowbite Logo" />
                        <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Innov Blog</span>
                    </a>
                    <button data-collapse-toggle="navbar-dropdown" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-dropdown" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.class=w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
                            <li>
                            <Link to="/" className="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Accueil</Link>
                            </li>
                            <li>
                                <button id="dropdownNvbarButton" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full py-2 px-3 rounded font-medium text-heading md:w-auto hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0">
                                Articles 
                                <svg className="w-4 h-4 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
                            </button>
                            {/* Dropdown menu */}
                            <div id="dropdownNavbar" className="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                                <ul className="p-2 text-sm text-body font-medium" aria-labelledby="dropdownNvbarButton">
                                    { userService.isLogged() && (
                                    <li>
                                    <Link to="/articles/new" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Ecrire un article</Link>
                                    </li>
                                    ) }
                                    <li>
                                    <Link to="/articles/list" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Liste des articles</Link>
                                    </li>
                                </ul>
                            </div>
                            </li>
                            {userService.isAdmin() && (
                            <li>
                            <Link to="/admin/dashboard" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Menu admin</Link>
                            </li>
                            )}
                            {!userService.isLogged() && (
                            <>
                            <li>
                            <Link to="/login" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Connexion</Link>
                            </li>
                            <li>
                            <Link to="/register" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Inscription</Link>
                            </li>
                            </>
                            )}
                            {userService.isLogged() && (
                            <li>
                            <a onClick={logout} className="block cursor-pointer py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Deconnexion</a>
                            </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;