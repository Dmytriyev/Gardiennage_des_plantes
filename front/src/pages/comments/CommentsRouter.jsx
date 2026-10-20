import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CommentsLayout from './CommentsLayout';
import NewComment from './NewComment';
import UpdateComment from './UpdateComment';

const CommentsRouter = () => {
    return (
        <Routes>
            <Route element={<CommentsLayout />}>
                <Route path="new/:article_id" element={<NewComment />} />
                <Route path="update/:id" element={<UpdateComment />} />
            </Route>
        </Routes>
    );
};

export default CommentsRouter;