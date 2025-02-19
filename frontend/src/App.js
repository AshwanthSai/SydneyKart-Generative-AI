import Footer from './Components/Layout/Footer';
import Header from './Components/Layout/Header';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import useUserRoutes from './Components/Routes/UserRoutes';
import useAdminRoutes from './Components/Routes/AdminRoutes';
import { ChatBot } from './Components/AIChat/ChatBot';
import NotFound from './Components/Admin/NotFound';


function App() {
  const UserRoutes = useUserRoutes();
  const Adminroutes = useAdminRoutes();

  return (
    <>
        <Router basename={process.env.REACT_APP_PUBLIC_URL}>
        <ToastContainer autoClose={1500} position="top-center" />
          <Header/>
          <div className='container'>
            <Routes>
            {UserRoutes}
            {Adminroutes}
            <Route path="*" element={<NotFound/>} />
            </Routes>
          </div>
          <ChatBot/>
          <Footer/>
        </Router>
    </>
  )
}

export default App;
