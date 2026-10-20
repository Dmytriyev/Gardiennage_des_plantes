import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../_services/user.service';

const OneUser = () => {

    const { id } = useParams()

    let navigate = useNavigate()

    const [ user, setUser ] = useState(null)
    const [ err, setErr ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ deleting, setDeleting ] = useState(false)

    useEffect(() => {
        userService.getOneUser(id)
            .then(res => {
                setUser(res.data)
                setLoaded(true)
            })
            .catch(error => {
                setErr(error)
                loaded(true)
            })
    })

    const handleDelete = async () => {
        try {
            setDeleting(true)
            await userService.deleteUser(user._id)
            navigate("/users/list")
        } catch (error) {
            setDeleting(false)
            alert(error)
        }
    }

    if ( !loaded ) {
        return(
            <div>
                <h2>Chargement...</h2>
            </div>
        )
    }
    else if ( err ) {
        return (
            <div>
                <h2>Erreur : {err}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <button onClick={() => { if ( window.confirm("Êtes vous sur de vouloir supprimer cet utilisateur ?") ) { handleDelete() } }}disabled={deleting}>Supprimer</button>
            </div>
        );
    }

};

export default OneUser;