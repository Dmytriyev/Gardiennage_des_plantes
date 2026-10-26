import { Link } from 'react-router-dom';
import { annonceTypes } from '../_helpers/annonceTypes';
import { timeAgo } from '../_helpers/timeAgo';
import { IconMapPin, IconMessage } from './Icons';

const AnnonceCard = ({ annonce, to = `/articles/one/${annonce._id}` }) => {
    const type = annonceTypes[annonce.type]

    return (
        <Link to={to} className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-foret/10">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img src={annonce.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                {type && (
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-md ${type.badge}`}>{type.label}</span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-extrabold leading-snug text-encre group-hover:text-feuille">{annonce.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-mousse">
                    <IconMapPin className="h-4 w-4 text-agrume" /> {annonce.city} · {annonce.distance}
                </p>
                <p className="mb-4 mt-3 line-clamp-3 text-sm text-mousse">{annonce.content}</p>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/5 pt-4 text-sm text-mousse">
                    <span className="flex items-center gap-2 font-semibold text-encre">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-soleil-clair font-extrabold text-agrume">{annonce.author.username[0]}</span>
                        {annonce.author.username}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <IconMessage className="h-4 w-4" /> {annonce.commentsCount}
                            <span className="sr-only">commentaires</span>
                        </span>
                        <span>{timeAgo(annonce.createdAt)}</span>
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default AnnonceCard;
