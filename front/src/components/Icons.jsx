// Icônes au trait (style Lucide). La couleur suit le texte : className="text-feuille"
const Icon = ({ children, className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        {children}
    </svg>
)

export const IconArrowRight = (props) => (
    <Icon {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>
)

export const IconPlus = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></Icon>
)

export const IconMapPin = (props) => (
    <Icon {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Icon>
)

export const IconMessage = (props) => (
    <Icon {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></Icon>
)

export const IconGift = (props) => (
    <Icon {...props}>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </Icon>
)

export const IconLuggage = (props) => (
    <Icon {...props}>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        <path d="M9 10v6" />
        <path d="M15 10v6" />
    </Icon>
)

export const IconHeart = (props) => (
    <Icon {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></Icon>
)

export const IconCheck = (props) => (
    <Icon {...props}><path d="M20 6 9 17l-5-5" /></Icon>
)

export const IconMenu = (props) => (
    <Icon {...props}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></Icon>
)

export const IconClose = (props) => (
    <Icon {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>
)
