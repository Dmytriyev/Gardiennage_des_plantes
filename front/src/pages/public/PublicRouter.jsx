import { Route, Routes } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import Home from "./Home"
import Register from './Register';
import Login from './Login';

const PublicRouter = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
            </Route>
        </Routes>
    );
};

export default PublicRouter;