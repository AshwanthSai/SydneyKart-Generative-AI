import Footer from './Components/Layout/Footer';
import Header from './Components/Layout/Header';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import AppRoutes from './Components/Routes/UserRoutes';


function App() {
  const UserRoutes = AppRoutes();

  return (
    <>
        <Router>
        <ToastContainer autoClose={1500} position="top-center" />
          <Header/>
          <div className='container'>
            <Routes>
            {UserRoutes}
            </Routes>
          </div>
          <Footer/>
        </Router>
    </>
  )
}

export default App;
