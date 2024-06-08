import './App.css';
// import DashBoardLayout from './components/DashBoardLayout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Createinvoice from './components/createinvoice';
import InvoiceList from './components/InvoiceList';
import Contact from './components/Contact';

function App() {
  return (
    <div>
      
      <Router>
      
        <Routes>
        {/* <Route path="/" exact element={<Home/>}/> */}
        <Route path="/" exact element={<Home/>}/>
          <Route path="/login" exact element={<Login/>}/>
          <Route path="/signup" exact element={<SignUp/>}/>
          <Route path ="/createinvoice" exact element ={<Createinvoice/>}/>
          <Route path ="/invoicelist" exact element = {<InvoiceList/>}/>
          <Route path ="/contact" exact element = {<Contact/>}/>
          {/* <Route path="/profile" component={Profile} /> */}
          {/* Add more routes for other pages */}
        </Routes>
    
      </Router>
    </div>
  );
}

export default App;
