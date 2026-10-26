import { useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
import { userService } from '../../_services/user.service';

const Login = () => {
    const [ credentials, setCredentials ] = useState({
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
        userService.login(credentials)
            .then(res => {
                userService.saveToken(res.data.token)
                window.location.href = "/"
            })
            .catch(error => {
                setErr(error)
            })
    }

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email">Adresse e-mail</label>
                    <input type="email" name="email" value={credentials.email} id="email" onChange={onChange} autoComplete="email" required/>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" value={credentials.password} id="password" onChange={onChange} autoComplete="current-password" required/>
                </div>
                <button type="submit">Valider</button>
            </form>
            {err && (
                <p>{ errorMessage(err) }</p>
            )}
        </div>
    );
};

export default Login;