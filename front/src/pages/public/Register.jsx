import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../_services/user.service';

const Register = () => {

    let navigate = useNavigate()

    const [ credentials, setCredentials ] = useState({
        username : "",
        email : "",
        password: ""
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
        userService.register(credentials)
            .then(() => {
                navigate("/")
            })
            .catch(error => {
                setErr(error)
            })
    }

    return (
        <div>
            <h1>Inscription</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input type="text" name="username" value={credentials.username} id="username" onChange={onChange}/>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={credentials.email} id="email" onChange={onChange}/>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" value={credentials.password} id="password" onChange={onChange}/>
                </div>
                <button type="submit">Valider</button>
            </form>
            {err && (
                <p>{ err?.response?.details || "Erreur" }</p>
            )}
        </div>
    );
};

export default Register;