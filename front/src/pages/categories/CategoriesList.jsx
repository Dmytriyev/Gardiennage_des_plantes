import { useEffect, useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
import { categoryService } from "../../_services/category.service"

const CategoriesList = () => {

    const [ categories, setCategories ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ err, setErr ] = useState(null)

    useEffect(() => {
        categoryService.getAllCategories()
            .then(res => {
                setCategories(res.data)
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
    else {
        return (
            <div>
                <h1>Liste des catégories</h1>
                { categories.length === 0  && (
                    <p>Pas de catégories</p>
                )}
                { categories.map(category => (
                    <div key={category._id}>
                        <h2>{category.name}</h2>
                    </div>
                )) }
            </div>
        );
    }

};

export default CategoriesList;