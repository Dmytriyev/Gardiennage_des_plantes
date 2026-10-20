import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../../_services/article.service';

const OneArticle = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [ article, setArticle ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ err, setErr ] = useState(null)
    const [ deleting, setDeleting ] = useState(false)

    useEffect(() => {
        articleService.getOneArticle(id)
            .then(res => {
                setArticle(res.data)
                setLoaded(true)
            })
            .catch(error => {
                setErr(error)
                setLoaded(true)
            })
    }, [])

    const handleDelete = async () => {
        try {
            setDeleting(true)
            await articleService.deleteArticle(article._id)
            navigate("/articles/list")
        } catch (error) {
            setDeleting(false)
            alert(error)
        }
    }
    
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
                {/* <p>Catégories : </p>
                <ul>
                    { article.categories.map(category => (
                        <li>{category.name}</li>
                    )) }
                    <h2>{article.title}</h2>
                    <p>{article.content}</p>
                    <p>Ecrit par {article.author.username} le {new Date(article.createdAt).toLocaleDateString("fr-FR")}</p>
                    <a href={`/articles/update/${article._id}`}>Mettre à jour</a>
                    <button onClick={ () => { if (window.confirm("Êtes vous sur de vouloir supprimer cet article ?")) { handleDelete() } } } disabled={deleting}>Supprimer</button>
                    <a href={`/comments/new/${article._id}`}>Laisser un commentaire</a>
                </ul>
                <h3>Commentaires ({article.commentaries.length}) </h3>
                <div>
                    { article.commentaries.map(comment => (
                    <div>
                        <p>{comment.content}</p>
                        <p>Ecrit par {comment.author.username} le {new Date(comment.createdAt).toLocaleDateString("fr-FR")}</p>
                        <a href={`/comments/update/${comment._id}`}>Modifier un commentaire</a>
                    </div>
                    )) }
                </div> */}
                
                <div class="m-auto bg-neutral-primary-soft block max-w-4xl p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
                    <div className='flex gap-1 mb-5'>
                        {article.categories.map(category => (
                        <p class="text-body bg-neutral-primary border border-default hover:bg-neutral-secondary-soft hover:text-heading focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-1/6">{category.name}</p>
                        ))}
                    </div>
                    <h5 class="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{article.title}</h5>
                    <p class="text-body">{article.content}</p>
                    <div className='flex justify-center gap-2'>
                        <Link to="/articles/list" class="text-white bg-success box-border border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Retour</Link>
                        <Link to={`/articles/update/${article._id}`} class="text-white bg-warning box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Modifier</Link>
                        <button onClick={ () => { if (window.confirm("Êtes vous sur de vouloir supprimer cet article ?")) { handleDelete() } } } disabled={deleting} class="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Supprimer</button>
                    </div>
                </div>

            </div>
        );
    }

};

export default OneArticle;