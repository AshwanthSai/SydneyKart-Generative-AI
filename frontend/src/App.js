import Footer from './Components/Layout/Footer';
import Header from './Components/Layout/Header';
import Home from "./Components/Home"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Profile from './Components/User/Profile';

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
              <Route path = "/me/profile" element={<Profile />} />  
            </Routes>
          </div>
          <Footer/>
        </Router>
    </>
  )
}

export default App;
