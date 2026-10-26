import { Route, Routes } from 'react-router-dom';
import CommentsLayout from './CommentsLayout';
import NewComment from './NewComment';
import UpdateComment from './UpdateComment';
import AuthGuard from '../../_helpers/AuthGuard';

const CommentsRouter = () => {
    return (
        <Routes>
            <Route element={<CommentsLayout />}>
                <Route path="new/:article_id" element={<AuthGuard><NewComment /></AuthGuard>} />
                <Route path="update/:id" element={<AuthGuard><UpdateComment /></AuthGuard>} />
            </Route>
        </Routes>
    );
};

export default CommentsRouter;