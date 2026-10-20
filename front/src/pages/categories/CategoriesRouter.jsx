import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CategoriesLayout from './CategoriesLayout';
import CategoriesList from './CategoriesList';
import CreateCategory from './CreateCategory';

const CategoriesRouter = () => {
    return (
        <Routes>
            <Route element={<CategoriesLayout />}>
                <Route path="list" element={<CategoriesList />} />
                <Route path="new" element={<CreateCategory />} />
            </Route>
        </Routes>
    );
};

export default CategoriesRouter;