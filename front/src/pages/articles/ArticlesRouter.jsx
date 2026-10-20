import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ArticlesLayout from './ArticlesLayout';
import ArticlesList from './ArticlesList';
import OneArticle from './OneArticle';
import NewArticle from './NewArticle';
import UpdateArticle from './UpdateArticle';
import AuthGuard from '../../_helpers/AuthGuard';

const ArticlesRouter = () => {
    return (
        <Routes>
            <Route element={<ArticlesLayout />}>
                <Route path="new" element={<AuthGuard><NewArticle /></AuthGuard>} />
                <Route path="list" element={<ArticlesList />} />
                <Route path="one/:id" element={<OneArticle />} />
                <Route path="update/:id" element={<AuthGuard><UpdateArticle /></AuthGuard>} />
            </Route>
        </Routes>
    );
};

export default ArticlesRouter;