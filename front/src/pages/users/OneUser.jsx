import { useEffect, useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
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
                setLoaded(true)
            })
    }, [id])

    const handleDelete = async () => {
        try {
            setDeleting(true)
            await userService.deleteUser(user._id)
            navigate("/users/list")
        } catch (error) {
            setDeleting(false)
            alert(errorMessage(error))
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
                <h2>Erreur&nbsp;: {errorMessage(err)}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <button onClick={() => { if ( window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur\u00a0?") ) { handleDelete() } }} disabled={deleting}>Supprimer</button>
            </div>
        );
    }

};

export default OneUser;