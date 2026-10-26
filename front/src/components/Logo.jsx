// Deux feuilles qui sortent d'une main (le bol jaune) : on donne, on prend soin
const Logo = ({ className = "h-10 w-10" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className} aria-hidden="true">
            <path d="M24 32V21" stroke="#1e4d33" strokeWidth="3" strokeLinecap="round" />
            <path d="M24 27C13 27 7 20 7 10c10 0 17 6 17 17Z" fill="#2f7d4a" />
            <path d="M24 23c0-9 6-16 17-16 0 10-7 16-17 16Z" fill="#7cc26a" />
            <path d="M9 31h30a15 13 0 0 1-30 0Z" fill="#f7b928" />
        </svg>
    );
};

export default Logo;
