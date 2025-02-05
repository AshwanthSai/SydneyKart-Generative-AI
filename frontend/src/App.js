import Footer from './Components/Layout/Footer';
import Header from './Components/Layout/Header';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import useUserRoutes from './Components/Routes/UserRoutes';
import useAdminRoutes from './Components/Routes/AdminRoutes';


function App() {
  const UserRoutes = useUserRoutes();
  const Adminroutes = useAdminRoutes();

  return (
    <>
        <Router>
        <ToastContainer autoClose={1500} position="top-center" />
          <Header/>
          <div className='container'>
            <Routes>
            {UserRoutes}
            {Adminroutes}
            </Routes>
          </div>
          <Footer/>
        </Router>
    </>
  )
}

export default App;
