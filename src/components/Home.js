import React from 'react'
import DashBoardLayout from './DashBoardLayout'
import './Home.css';
import Image1 from '../assets/image 1.png'
function Home() {

  
  
  return (
    
    <div>
        <DashBoardLayout/>
        <div className='homeContent'>
            <h3>Dashboard
              </h3>
              <p>Income</p>
              <p>Expense</p>
              <img src={Image1} alt='profit&loss'/>
        </div>
       
    </div>
  )
}

export default Home