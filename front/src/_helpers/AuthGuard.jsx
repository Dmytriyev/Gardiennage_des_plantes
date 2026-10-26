import { userService } from '../_services/user.service';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({children}) => {
    if ( !userService.isLogged() ) {
        return <Navigate to="/login" />
    }

    return children

};

export default AuthGuard;