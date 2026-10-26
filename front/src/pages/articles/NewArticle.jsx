import { useEffect, useState } from 'react';
import { errorMessage } from '../../_helpers/errorMessage';
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
                categories : credentials.categories.filter(id => id !== categoryId)
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
                <h2>Erreur&nbsp;: {errorMessage(catErr)}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1 className='text-center font-bold text-4xl'>Nouvelle annonce</h1>
                <div className='border border-amber-600 rounded w-1/3 m-auto p-5'>
                    <form onSubmit={onSubmit}>
                        <p>Catégories&nbsp;:</p>
                        {categories.map(category => (
                            <div key={category._id} className="flex items-center mb-4">
                                <input id={category.name} name={category.name} type="checkbox" value={category._id} onChange={onCategoryChange} className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"/>
                                <label htmlFor={category.name} className="select-none ms-2 text-sm font-medium text-heading">{category.name}</label>
                            </div>
                        ))}
                        <div>
                            <label htmlFor="title" className="block mb-2.5 text-sm font-medium text-heading">Titre</label>
                            <input type="text" id="title" name="title" value={credentials.title} onChange={onChange} className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body" placeholder="" required />
                        </div>
                        <div>
                            <label htmlFor="content" className="block mb-2.5 text-sm font-medium text-heading">Description</label>
                            <textarea id="content" name="content" defaultValue={credentials.content} onChange={onChange} rows="4" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body" ></textarea>
                        </div>
                        <button type="submit" className="text-white bg-success box-border border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Valider</button>
                    </form>
                    { err && (
                        <p>{errorMessage(err)}</p>
                    ) }
                </div>

            </div>
        );
    }

};

export default NewArticle;