import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UsersLayout from './UsersLayout';
import ListUsers from './ListUsers';
import OneUser from './OneUser';

const UsersRouter = () => {
    return (
        <Routes>
            <Route element={<UsersLayout />}>
                <Route path="list" element={<ListUsers />} />
                <Route path="one/:id" element={<OneUser />} />
            </Route>
        </Routes>
    );
};

export default UsersRouter;