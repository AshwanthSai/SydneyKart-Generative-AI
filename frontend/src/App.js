import Footer from './Components/Layout/Footer';
import Header from './Components/Layout/Header';
import Home from "./Components/Home"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Header/>
        <div className='container'>
          <Routes>
            <Route path = "/" element={<Home />} />  
          </Routes>
        </div>
        <Footer/>
      </Router>
    </>
  )
}

export default App;
