import Header from '../../components/Header';
import { Outlet } from 'react-router-dom';

const CommentsLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};

export default CommentsLayout;