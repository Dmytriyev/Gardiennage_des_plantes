import { useEffect, useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
import { useNavigate, useParams } from 'react-router-dom';
import { commentService } from '../../_services/commentary.service';

const UpdateComment = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [ credentials, setCredentials ] = useState({
        content : ""
    })
    const [ comment, setComment ] = useState(null)
    const [ err, setErr ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ deleting, setDeleting ] = useState(false)

    useEffect(() => {
        commentService.getOneComment(id)
            .then(res => {
                setCredentials({
                    content : res.data.content || ""
                })
                setComment(res.data)
                setLoaded(true)
            })
            .catch(error => {
                setErr(error)
                setLoaded(true)
            })
    }, [id])

    const onChange = (e) => {
        setCredentials({
            ...credentials,
            [ e.target.name ] : e.target.value
        })
    }
    
    const onSubmit = (e) => {
        e.preventDefault()
        commentService.updateComment(id, credentials)
            .then(() => {
                navigate(`/articles/one/${comment.article}`)
            })
            .catch(error => {
                setErr(error)
            })
    }

    const handleDelete = async () => {
        try {
            setDeleting(true)
            await commentService.deleteComment(comment._id)
            navigate(`/articles/one/${comment.article}`)
        } catch (error) {
            setDeleting(false)
            alert(errorMessage(error))
        }
    }

    if( !loaded ) {
        return(
            <div>
                <h2>Chargement...</h2>
            </div>
        )
    }

    return (
        <div>
            <h1>Mise à jour d'un commentaire</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="content">Votre commentaire</label>
                    <textarea name="content" id="content" defaultValue={credentials.content} onChange={onChange}></textarea>
                </div>
                <button type="submit">Valider</button>
            </form>
            {err && (
                <p>{errorMessage(err)}</p>
            )}
            <button onClick={ () => { if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire\u00a0?")) { handleDelete() } } } disabled={deleting}>Supprimer</button>
        </div>
    );
};

export default UpdateComment;