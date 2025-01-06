import React from 'react'
import './Signup.css';
import {useState, useEffect} from 'react'
import axios from '../api/axios'
import {NavLink, useNavigate} from 'react-router-dom'
import Select  from 'react-select';
import Flag from 'react-world-flags'

function SignUp() {
  const [username, setUserName] = useState('');
  const[phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedOption, setSelectedOption] = useState();
  const [countriesList, setCountriesList] = useState([]);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const countries = data.map((country) => ({
                    code: country.cca2,
                    name: country.name.common,
                    dial_code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
                    flag: country.flag,
                  }));
        console.log(countries);
        setCountriesList(countries);        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
   
   
    
 

  const sortedItems = countriesList.sort((a, b) => a.name.localeCompare(b.name));

  const options = sortedItems.map((country) => ({
    value: country.dial_code,
    label: `${country.name} (${country.dial_code})`,
    customLabel: (
      <div style={{ display: "flex", alignItems: "center", width: "100px" }}>
        <Flag code={country.code} style={{ width: "40px", marginRight: "9px", marginLeft: "-3px", marginTop: "-1px"}} />
        <span>{country.name}</span>
        <span style={{ marginLeft: "auto" }}>{country.dial_code}</span>
      </div>
    ),    
  }));

  //Handle SIgnIn
  const REGISTER_URL = '/api/Auth/AddUser';

  const handleSignIn = async () => {

    if(phoneNumber.startsWith(0)){
      phoneNumber.slice(1);
    }

    const pNumber = `${selectedOption}${phoneNumber}`;
    console.log(pNumber);
      try{
        var response = await axios.post(REGISTER_URL, {
          email: username,
          phonenumber: pNumber,
          password,
          confirmPassword
        }    
      , {
        // headers: {
        //   "Content-Type": "Application/json"
        // }
  
        
      });
        if(response.status === 200){ 
          
          alert("Registration successful");
          navigate("/login");
        }
        else{
          alert('Registration failed');
        }
      }
      catch(error){
        console.error('Register error:', error);
      }
  }

  
  return (
    <>
        <div className='signup-container'>
        <div>
            <br/>
        <h2 className='start'>Get Started</h2>
        <p className='start2'>Already have an account.  <NavLink to='/login'>Sign In</NavLink></p>      
        </div>
        
        <form className='signup-form'>
        <label>Email Address</label>
        <input type='text' value={username} onChange={(e) => setUserName(e.target.value)}placeholder='Email Address'/><br/><br/>
        <label>PhoneNumber</label>
        <div style={{display: 'flex', width: 300, marginLeft: -50, alignItems: 'center'}}>
        <Select
          options={options}
          value={options.find((option) => option.value === selectedOption)}
          filterOption={(candidate, input) => 
            candidate.data.label.toLowerCase().includes(input.toLowerCase())}
          onChange={(selected) => setSelectedOption(selected.value)}
          getOptionLabel={(e) => e.customLabel}        
          styles={{
            control: (base) => ({ ...base, width: 100 }),
          }}
    />
        <input type='tel' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}placeholder='Enter PhoneNumber' className='telephone'/><br/><br/>
        </div><br/>
        <label>Password</label><br/>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}placeholder='Password'/>
        <i className={`material-icons ${visible ? 'visible' : 'hidden'}`}  
          onClick={togglePasswordVisibility}          
          >
            {visible ? 'visibility' : 'visibility_off'}</i><br/><br/>
        <label>Confirm Password</label>
        <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}placeholder='Password'/>
        <i className={`material-icons ${visible ? 'visible' : 'hidden'}`}  
          onClick={togglePasswordVisibility}          
          >
            {visible ? 'visibility' : 'visibility_off'}</i><br/>
        <p className='underlay'>By creating an account you agree to our <span>Terms and Conditions</span></p>
        <button type='submit' onClick={handleSignIn} id='createaccount'>Create Account</button><br/>        
        </form>
        
        
    </div>
    </>
  )
}

export default SignUp