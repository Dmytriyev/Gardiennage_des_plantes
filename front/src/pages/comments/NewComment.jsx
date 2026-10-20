import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { commentService } from '../../_services/commentary.service';

const NewComment = () => {

    const { article_id } = useParams()
    const navigate = useNavigate()

    const [ credentials, setCredentials ] = useState({
        content : ""
    })
    const [ err, setErr ] = useState(null)

    const onChange = (e) => {
        setCredentials({
            ...credentials,
            [ e.target.name ] : e.target.value
        })
    }
    
    const onSubmit = (e) => {
        e.preventDefault()
        commentService.createComment(credentials, article_id)
            .then(() => {
                navigate("/articles/list")
            })
            .catch(error => {
                setErr(error)
            })
    }

    return (
        <div>
            <h1>Nouveau commentaire</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="content">Votre commentaire</label>
                    <textarea name="content" id="content" defaultValue={credentials.content} onChange={onChange}></textarea>
                </div>
                <button type="submit">Valider</button>
            </form>
            {err && (
                <p>Erreur</p>
            )}
        </div>
    );
};

export default NewComment;