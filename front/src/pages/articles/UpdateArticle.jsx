import React, { useState } from 'react';
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
    }, [])

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
                <h2>Erreur : {catErr}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>Mise à jour de l'article</h1>
                <form onSubmit={onSubmit}>
                    <p>Catégories :</p>
                    {categories.map(category => (
                        <div>
                            <label htmlFor={category.name}>{category.name}</label>
                            <input type="checkbox" name={category.name} id={category.name} value={category._id} checked={credentials.categories.includes(category._id)} onChange={onCategoryChange}/>
                        </div>
                    ))}
                    <div>
                        <label htmlFor="title">Titre</label>
                        <input type="text" name="title" id="title" value={credentials.title} onChange={onChange}/>
                    </div>
                    <div>
                        <label htmlFor="content">Contenu</label>
                        <textarea name="content" id="content" defaultValue={credentials.content} onChange={onChange}></textarea>
                    </div>
                    <button type="submit">Valider</button>
                </form>
                { err && (
                    <p>Erreur</p>
                ) }

            </div>
        );
    }
};

export default UpdateArticle;