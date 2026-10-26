import { useEffect, useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
import { articleService } from '../../_services/article.service';
import { Link } from 'react-router-dom';

const ArticlesList = () => {

    const [ articles, setArticles ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ err, setErr ] = useState(null)

    useEffect(() => {
        articleService.getAllArticles()
            .then(res => {
                setArticles(res.data)
                setLoaded(true)
            })
            .catch(error => {
                setErr(error)
                setLoaded(true)
            })
    }, [])

    if ( !loaded ) {
        return (
            <div>
                <h2>Chargement...</h2>
            </div>
        )
    }
    else if (err) {
        return (
            <div>
                <h2>Erreur&nbsp;: {errorMessage(err)}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1 className='text-center text-4xl font-bold mt-5 mb-5'>Toutes les annonces</h1>
                { articles.length === 0 && (
                    <p className='text-center text-mousse'>Aucune annonce pour le moment.</p>
                )}
                <div className='flex justify-center gap-5 flex-wrap'>
                    { articles.map(article => (
                    <Link key={article._id} to={`/articles/one/${article._id}`} className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
                        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{article.title}</h2>
                        <p className="text-body">Publiée par <span className='text-feuille'>{article.author?.username ?? "un membre supprimé"}</span> le <span className='text-feuille'>{new Date(article.createdAt).toLocaleDateString("fr-FR")}</span></p>
                    </Link>
                    )) }
                </div>
            </div>
        );
    }

};

export default ArticlesList;
