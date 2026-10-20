import React, { useEffect, useState } from 'react';
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
                <h2>Erreur : {err}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1 className='text-center text-4xl font-bold mt-5 mb-5'>Liste des articles</h1>
                <div className='flex justify-center gap-5 flex-wrap'>
                    { articles.map(article => (
                    // <div>
                    //     <h2>{article.title}</h2>
                    //     <p>Catégories :</p>
                    //     <ul>
                    //     { article.categories.map(category => (
                    //         <li>{category.name}</li>
                    //     )) }
                    //     </ul>
                    //     <p>Ecrit par {article.author.username}</p>
                    //     <a href={`/articles/one/${article._id}`}>Voir l'article</a>
                    // </div>
                    
                    <Link to={`/articles/one/${article._id}`} class="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
                        <h5 class="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{article.title}</h5>
                        <p class="text-body">ecrit par <span className='text-blue-500'>{article.author.username}</span> le <span className='text-blue-500'>{new Date(article.createdAt).toLocaleDateString("fr-FR")}</span></p>
                    </Link>

                    )) }
                </div>
            </div>
        );
    }

};

export default ArticlesList;