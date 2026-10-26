import { useEffect, useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
import { userService } from '../../_services/user.service';
import "./users.css"

const ListUsers = () => {

    const [ users, setUsers ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ err, setErr ] = useState(null)

    useEffect(() => {
        userService.getAllUsers()
            .then(res => {
                setUsers(res.data)
                setLoaded(true)
            })
            .catch(error => {
                setErr(error)
                setLoaded(true)
            })
    }, [])

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
    else{
        return (
            <div className='users'>
                <h1>Liste des utilisateurs</h1>
                <div className='users_card'>
                    { users.map(user => (
                        <div key={user._id}>
                            <h2>{user.username}</h2>
                            <a href={`/users/one/${user._id}`}>Voir le profil</a>
                        </div>
                    )) }
                </div>
            </div>
        );
    }

};

export default ListUsers;