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
import Cart from './Components/Cart/Cart';
import ShippingInfo from './Components/Cart/ShippingInfo';
import ConfirmOrder from './Components/Cart/ConfirmOrder';
import PaymentMethod from './Components/Cart/PaymentMethod';

function App() {
  return (
    <>
        <Router>
        <ToastContainer autoClose={1500} position="top-center" />
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

            <Route path = "/cart" element={
                    <Cart />
            }/>  

            <Route path = "/shipping" element={
                <ProtectedComponent>
                    <ShippingInfo />
                </ProtectedComponent>}
            />  

            <Route path = "/confirm_order" element={
                <ProtectedComponent>
                    <ConfirmOrder />
                </ProtectedComponent>}
            />  

            <Route path = "/payment_method" element={
                <ProtectedComponent>
                    <PaymentMethod />
                </ProtectedComponent>}
            />  

            </Routes>
          </div>
          <Footer/>
        </Router>
    </>
  )
}

export default App;
