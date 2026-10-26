import { userService } from '../_services/user.service';
import { Navigate } from 'react-router-dom';

const AdminGuard = ({children}) => {
    if ( !userService.isLogged() ) {
        return <Navigate to="/login" />
    }

    if ( !userService.isAdmin() ) {
        return <Navigate to="/" />
    }

    return children
};

export default AdminGuard;