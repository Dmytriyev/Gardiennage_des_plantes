import { useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
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
                navigate("/login")
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
                    <label htmlFor="username">Pseudo (3 à 10 caractères)</label>
                    <input type="text" name="username" value={credentials.username} id="username" onChange={onChange} minLength={3} maxLength={10} autoComplete="username" required/>
                </div>
                <div>
                    <label htmlFor="email">Adresse e-mail</label>
                    <input type="email" name="email" value={credentials.email} id="email" onChange={onChange} autoComplete="email" required/>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe (15 à 30 caractères)</label>
                    <input type="password" name="password" value={credentials.password} id="password" onChange={onChange} minLength={15} maxLength={30} autoComplete="new-password" required/>
                </div>
                <button type="submit">Valider</button>
            </form>
            {err && (
                <p>{ errorMessage(err) }</p>
            )}
        </div>
    );
};

export default Register;