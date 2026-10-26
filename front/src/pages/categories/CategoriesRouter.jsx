import { Route, Routes } from 'react-router-dom';
import CategoriesLayout from './CategoriesLayout';
import CategoriesList from './CategoriesList';
import CreateCategory from './CreateCategory';
import AdminGuard from '../../_helpers/AdminGuard';

const CategoriesRouter = () => {
    return (
        <Routes>
            <Route element={<CategoriesLayout />}>
                <Route path="list" element={<CategoriesList />} />
                <Route path="new" element={<AdminGuard><CreateCategory /></AdminGuard>} />
            </Route>
        </Routes>
    );
};

export default CategoriesRouter;