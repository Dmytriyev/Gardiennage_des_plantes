import { useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
import { useEffect } from 'react';
import { categoryService } from '../../_services/category.service';
import { articleService } from '../../_services/article.service';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateArticle = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [ categories, setCategories ] = useState(null)
    const [ credentials, setCredentials ] = useState({
        categories : [],
        title : "",
        content : ""
    })
    const [ err, setErr ] = useState(null)
    const [ catErr, setCatErr ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)

    useEffect(() => {
        Promise.all([
            categoryService.getAllCategories(),
            articleService.getOneArticle(id)
        ])
        .then(([categoriesRes, articleRes]) => {
            setCategories(categoriesRes.data)
            setCredentials({
                title : articleRes.data.title,
                content : articleRes.data.content,
                categories : articleRes.data.categories.map(cat => cat._id) || []
            })
            setLoaded(true)
        })
        .catch(error => {
            setCatErr(error)
            setLoaded(true)
        })
    }, [id])

    const onChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name] : e.target.value
        })
    }
    
    const onCategoryChange = (e) => {
        const categoryId = e.target.value

        if ( e.target.checked ) {
            setCredentials({
                ...credentials,
                categories : [...credentials.categories, categoryId]
            })
        }
        else {
            setCredentials({
                ...credentials,
                categories : credentials.categories.filter(id => id !== categoryId)
            })
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        articleService.updateArticle(id, credentials)
            .then(() => {
                navigate("/articles/list")
            })
            .catch(error => {
                setErr(error)
            })
    }

   if ( !loaded ) {
        return (
            <div>
                <h2>Chargement...</h2>
            </div>
        )
    }
    else if (catErr) {
        return (
            <div>
                <h2>Erreur&nbsp;: {errorMessage(catErr)}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>Modifier l'annonce</h1>
                <form onSubmit={onSubmit}>
                    <p>Catégories&nbsp;:</p>
                    {categories.map(category => (
                        <div key={category._id}>
                            <label htmlFor={category.name}>{category.name}</label>
                            <input type="checkbox" name={category.name} id={category.name} value={category._id} checked={credentials.categories.includes(category._id)} onChange={onCategoryChange}/>
                        </div>
                    ))}
                    <div>
                        <label htmlFor="title">Titre</label>
                        <input type="text" name="title" id="title" value={credentials.title} onChange={onChange}/>
                    </div>
                    <div>
                        <label htmlFor="content">Description</label>
                        <textarea name="content" id="content" defaultValue={credentials.content} onChange={onChange}></textarea>
                    </div>
                    <button type="submit">Valider</button>
                </form>
                { err && (
                    <p>{errorMessage(err)}</p>
                ) }

            </div>
        );
    }
};

export default UpdateArticle;