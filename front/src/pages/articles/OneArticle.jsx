import { useEffect, useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../../_services/article.service';
import { userService } from '../../_services/user.service';

const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR")

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
    }, [id])

    const handleDelete = async () => {
        try {
            setDeleting(true)
            await articleService.deleteArticle(article._id)
            navigate("/articles/list")
        } catch (error) {
            setDeleting(false)
            alert(errorMessage(error))
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
                <h2>Erreur&nbsp;: {errorMessage(err)}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <div className="m-auto bg-neutral-primary-soft block max-w-4xl p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
                    <div className='flex gap-1 mb-5'>
                        {article.categories.map(category => (
                        <p key={category._id} className="text-body bg-neutral-primary border border-default hover:bg-neutral-secondary-soft hover:text-heading focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-1/6">{category.name}</p>
                        ))}
                    </div>
                    <h1 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{article.title}</h1>
                    <p className="mb-3 text-sm text-mousse">Publiée par {article.author?.username ?? "un membre supprimé"} le {formatDate(article.createdAt)}</p>
                    <p className="text-body">{article.content}</p>
                    <div className='flex justify-center gap-2'>
                        <Link to="/articles/list" className="text-white bg-success box-border border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Retour</Link>
                        {userService.isAuthorOrAdmin(article.author?._id) && (
                            <>
                            <Link to={`/articles/update/${article._id}`} className="text-white bg-warning box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Modifier</Link>
                            <button onClick={ () => { if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce\u00a0?")) { handleDelete() } } } disabled={deleting} className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Supprimer</button>
                            </>
                        )}
                    </div>
                </div>

                <section className="m-auto max-w-4xl p-6">
                    <h2 className="mb-4 text-xl font-bold text-foret">Commentaires ({article.commentaries.length})</h2>
                    {article.commentaries.length === 0 && (
                        <p className="text-mousse">Aucun commentaire pour le moment.</p>
                    )}
                    <ul className="space-y-3">
                        {article.commentaries.map(comment => (
                            <li key={comment._id} className="rounded-2xl bg-white p-4 shadow-sm">
                                <p>{comment.content}</p>
                                <p className="mt-1 text-sm text-mousse">Écrit par {comment.author?.username ?? "un membre supprimé"} le {formatDate(comment.createdAt)}</p>
                                {userService.isAuthorOrAdmin(comment.author?._id) && (
                                    <Link to={`/comments/update/${comment._id}`} className="text-sm font-semibold text-feuille hover:text-foret">Modifier</Link>
                                )}
                            </li>
                        ))}
                    </ul>
                    {userService.isLogged() ? (
                        <Link to={`/comments/new/${article._id}`} className="btn btn-primary mt-4">Laisser un commentaire</Link>
                    ) : (
                        <p className="mt-4 text-mousse"><Link to="/login" className="font-semibold text-feuille hover:text-foret">Connectez-vous</Link> pour laisser un commentaire.</p>
                    )}
                </section>
            </div>
        );
    }

};

export default OneArticle;
