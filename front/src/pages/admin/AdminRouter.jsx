import { Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';

const AdminRouter = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default AdminRouter;