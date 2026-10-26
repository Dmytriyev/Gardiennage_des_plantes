import { useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
import { categoryService } from '../../_services/category.service';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {

    let navigate = useNavigate()

    const [ credentials, setCredentials ] = useState({
        name: ""
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
        categoryService.createCategory(credentials)
            .then(() => {
                navigate("/categories/list")
            })
            .catch(error => {
                setErr(error)
            })
    }

    return (
        <div>
            <h1>Ajout d'une nouvelle catégorie</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Nom</label>
                    <input type="text" name="name" value={credentials.name} id="name" onChange={onChange}/>
                </div>
                <button type="submit">Valider</button>
            </form>
            {err && (
                <p>{ errorMessage(err) }</p>
            )}
        </div>
    );
};

export default CreateCategory;