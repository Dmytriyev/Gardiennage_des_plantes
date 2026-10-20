import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/public/Home'
import PublicRouter from './pages/public/PublicRouter'
import UsersRouter from './pages/users/UsersRouter'
import CategoriesRouter from './pages/categories/CategoriesRouter'
import ArticlesRouter from './pages/articles/ArticlesRouter'
import CommentsRouter from './pages/comments/CommentsRouter'
import AdminGuard from './_helpers/AdminGuard'
import AdminRouter from './pages/admin/AdminRouter'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PublicRouter />} />
        <Route path="/users/*" element={<AdminGuard><UsersRouter /></AdminGuard>} />
        <Route path="/categories/*" element={<CategoriesRouter />} />
        <Route path="/articles/*" element={<ArticlesRouter />} />
        <Route path="/comments/*" element={<CommentsRouter />} />
        <Route path="/admin/*" element={<AdminGuard><AdminRouter /></AdminGuard>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
