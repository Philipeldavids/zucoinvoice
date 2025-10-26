import './App.css';
// import DashBoardLayout from './components/DashBoardLayout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Createinvoice from './components/createinvoice';
import InvoiceList from './components/InvoiceList';
import Contact from './components/Contact';
import Settings from './components/Settings';
import { InvoiceProvider } from './context/InvoiceContext';
import InvoicePage from './components/InvoicePage';
import SubscriptionPage from './components/Subscription';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
   <InvoiceProvider>
    <div>
      
      <Router>
      
        <Routes>
        {/* <Route path="/" exact element={<Home/>}/> */}
        <Route path="/dashboard" exact element={<Dashboard />}/>
        <Route path="/landingpage" exact element={<LandingPage />} />
        <Route path ="/" exact element ={<LandingPage/>}/>
          <Route path="/login" exact element={<Login/>}/>
          <Route path="/signup" exact element={<SignUp/>}/>
          <Route path ="/createinvoice" exact element ={<Createinvoice/>}/>
          <Route path ="/invoicelist" exact element = {<InvoiceList/>}/>
          <Route path ="/contact" exact element = {<Contact/>}/>
          <Route path ="/usersettings" exact element ={<Settings/>} />
          <Route path ="/invoicepage" exact element = {<InvoicePage/>}/>
          <Route path ="/subscription" exact element = {<SubscriptionPage/>}/>
          <Route path = "/forgotpassword" exact element = {<ForgotPassword />}/>
          {/* <Route path="/profile" component={Profile} /> */}
          {/* Add more routes for other pages */}
        </Routes>
    
      </Router>
    </div>
    </InvoiceProvider> 
  );
}

export default App;
