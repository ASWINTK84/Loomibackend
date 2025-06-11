import React from 'react'
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Header from './components/layout/Header';
import Pagenotfound from './pages/Pagenotfound';
import Footer from './components/layout/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import Register from './pages/auth/Register';
import { ToastContainer } from "react-toastify";
import Login from './pages/auth/Login';
import { AuthProvider } from './context/auth';
import PrivateRoute from './components/routes/Private';
import Dashboard from './user/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminRoute from './components/routes/AdminRoute';
import AdminDashboard from './pages/admin/adminDashboard';
import AdminMenu from './components/layout/AdminMenu';
import Createcategory from './pages/admin/Createcategory';
import CreateProduct from './pages/admin/CreateProduct';
import Users from './pages/admin/Users';
import Orders from './user/Orders';
import Profile from './user/Profile';
import Product from './pages/admin/Product';
import UpdateProduct from './pages/admin/UpdateProduct';





const App = () => {



  return (
    <AuthProvider>
      <div>
      
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/dashboard' element={<PrivateRoute />}>
          <Route path='user' element={<Dashboard />}></Route>
          <Route path='user/orders' element={<Orders />}></Route>
          <Route path='user/profile' element={<Profile />}></Route>
        </Route>
        <Route path='/dashboard' element={<AdminRoute />}>
          <Route path='admin' element={<AdminDashboard/>}></Route>
           <Route path='admin/create-category' element={<Createcategory/>}></Route>
        <Route path='admin/create-product' element={<CreateProduct/>}></Route>
         <Route path='admin/product' element={<Product/>}></Route>
        <Route path='admin/users' element={<Users/>}></Route>
        <Route path="admin/update-product/:id" element={<UpdateProduct />} />
        </Route>
        <Route path='/*' element={<Pagenotfound/>}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/contact' element={<Contact />}></Route>  
        <Route path='/policy' element={<Policy />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/adminmenu' element={<AdminMenu/>}></Route>
    
        
      </Routes>
      <div ><Footer /></div> 
      <ToastContainer position="top-center" autoClose={3000}/>
      </BrowserRouter>

     
      
     

    </div>
    </AuthProvider>
  )
}

export default App