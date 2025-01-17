import Footer from './Components/Layout/Footer';
import Header from './Components/Layout/Header';
import Home from "./Components/Home"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Profile from './Components/User/Profile';
import UpdateProfile from './Components/User/UpdateUser';
import ProtectedComponent from './Components/Auth/ProtectedComponent';
import UploadAvatar from './Components/User/UploadAvatar';
import UpdatePassword from './Components/User/UpdatePassword';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';

function App() {
  return (
    <>
        <Router>
        <ToastContainer position="top-center" />
          <Header/>
          <div className='container'>
            <Routes>
              <Route path = "/" element={<Home />} />  
              <Route path = "/login" element={<Login />} />  
              <Route path = "/register" element={<Register />} />  
              <Route path = "/products/:id" element={<ProductDetails />} />  
              <Route path = "password/htmlForgot" element={<ForgotPassword />} />  
              <Route path = "password/reset/:token" element={<ResetPassword />} />  
              
              <Route path = "/me/profile" element={
                  <ProtectedComponent>
                    <Profile />
                  </ProtectedComponent>
                }
              />  
              <Route path = "/me/update_profile" element={
                 <ProtectedComponent>
                    <UpdateProfile />
                </ProtectedComponent>
              }/>  

              <Route path = "/me/upload_avatar" element={
                 <ProtectedComponent>
                    <UploadAvatar />
                </ProtectedComponent>
              }/>  

              <Route path = "/me/update_password" element={
                 <ProtectedComponent>
                    <UpdatePassword />
                </ProtectedComponent>
              }/>  
            </Routes>
          </div>
          <Footer/>
        </Router>
    </>
  )
}

export default App;
