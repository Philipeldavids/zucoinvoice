import React, {useState} from 'react';
import './Login.css'
import axios from "../api/axios"
import { NavLink, useNavigate} from 'react-router-dom';


function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };
  const LOGIN_URL = '/api/Auth/Login';
  const navigate = useNavigate();

  const handleLogin = async (event)=>{  
    event.preventDefault();
    try{
      const response = await axios.post(LOGIN_URL, {
        email: username,
        password,
    }, {
      // headers: {
      //   "Content-Type": "Application/json"
      // }

      
    });
      if(response.status === 200){
        
       sessionStorage.setItem('user', JSON.stringify(response.data))
        navigate("/dashboard");
      }
      else{
        alert('Authentication failed');
      }
    }
    catch(error){
      console.error('Login error:', error);
    }
  }
  return (
    <div className="login-page">
        <br/>
        <h2 className='welcome'>Welcome Back! SignIn</h2>
        <form className='login-form'>
          <label>Email Address</label><br/>
          <input type='text' placeholder='Email Address' value={username} onChange={(e) => setUsername(e.target.value)} /><br/><br/>
          <label>Password</label><br/>
          <input type={visible? 'text':'password'} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <i className={`material-icons ${visible ? 'visible' : 'hidden'}`}  
          onClick={togglePasswordVisibility}
          
          >
            {visible ? 'visibility' : 'visibility_off'}</i><br/>
          <div className='remember-me'>
              
              <input type='checkbox' className='checkbox'/>
              <p className='underlay1'>Remember me</p>            
              <p className='underlay2'>Forgot password</p>
          </div><br/>

          <div className='login-signup'>
          <button type='submit' className='button'onClick={(event)=>handleLogin(event)} >Sign In</button>
          <NavLink to='/signup'>Sign Up</NavLink>
          
          </div>
        </form>
    </div>
  )
}

export default Login