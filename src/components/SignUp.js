import React from 'react'
import './Signup.css';

function SignUp() {
  return (
    <div className='signup-container'>
        <div>
            <br/>
        <h2 className='start'>Get Started</h2>
        <p className='start2'>Already have an account.  <span>Sign In</span></p>      
        </div>
        
        <form className='signup-form'>
        <label>Email Address</label><br/>
        <input type='text' placeholder='Email Address'/><br/><br/>
        <label>PhoneNumber</label><br/>
        <input type="text" className='phone-card'/>
        <input type='tel' value='+234' placeholder='9045201688' className='telephone'/><br/><br/>
        <label>Password</label><br/>
        <input type='password' placeholder='Password'/>
        <i className="material-icons">visibility_off</i><br/><br/>
        <label>Confirm Password</label><br/>
        <input type='password' placeholder='Password'/>
        <i className="material-icons">visibility_off</i><br/>
        <p className='underlay'>By creating an account you agree to our <span>Terms and Conditions</span></p><br/>
        <button type='submit' id='createaccount'>Create Account</button><br/>
        <p className='sign-in'>Sign In</p>
        </form>
        
        
    </div>
  )
}

export default SignUp