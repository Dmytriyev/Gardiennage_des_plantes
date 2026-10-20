import React, { useEffect, useState } from 'react';
import { categoryService } from '../../_services/category.service';
import { articleService } from '../../_services/article.service';
import { useNavigate } from 'react-router-dom';

const NewArticle = () => {

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
        categoryService.getAllCategories()
            .then(res => {
                setCategories(res.data)
                setLoaded(true)
            })
            .catch(catError => {
                setCatErr(catError)
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
                categories : [ credentials.categories.filter(id => id !== categoryId) ]
            })
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        articleService.createArticle(credentials)
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
                <h1 className='text-center font-bold text-4xl'>Nouvel article</h1>
                <div className='border border-amber-600 rounded w-1/3 m-auto p-5'>
                    <form onSubmit={onSubmit}>
                        <p>Catégories :</p>
                        {categories.map(category => (
                            // <div>
                            //     <label htmlFor={category.name}>{category.name}</label>
                            //     <input type="checkbox" name={category.name} id={category.name} value={category._id} onChange={onCategoryChange}/>
                            // </div>
                            <div class="flex items-center mb-4">
                                <input id={category.name} name={category.name} type="checkbox" value={category._id} onChange={onCategoryChange} class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"/>
                                <label htmlFor={category.name} class="select-none ms-2 text-sm font-medium text-heading">{category.name}</label>
                            </div>
                        ))}
                        {/* <div>
                            <label htmlFor="title">Titre</label>
                            <input type="text" name="title" id="title" value={credentials.title} onChange={onChange}/>
                        </div> */}
                        <div>
                            <label htmlFor="title" class="block mb-2.5 text-sm font-medium text-heading">Titre</label>
                            <input type="text" id="title" name="title" value={credentials.title} onChange={onChange} class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body" placeholder="" required />
                        </div>
                        {/* <div>
                            <label htmlFor="content">Contenu</label>
                            <textarea name="content" id="content" defaultValue={credentials.content} onChange={onChange}></textarea>
                        </div> */}
                        <div>
                            <label htmlFor="content" class="block mb-2.5 text-sm font-medium text-heading">Contenu de l'article</label>
                            <textarea id="content" name="content" defaultValue={credentials.content} onChange={onChange} rows="4" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body" ></textarea>
                        </div>
                        <button type="submit" class="text-white bg-success box-border border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Valider</button>
                    </form>
                    { err && (
                        <p>Erreur</p>
                    ) }
                </div>

            </div>
        );
    }

};

export default NewArticle;