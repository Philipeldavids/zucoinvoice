import React, { useEffect } from 'react'
import DashBoardLayout from './DashBoardLayout'
import styles from './Home.module.css';
import Image1 from '../assets/image 1.png';
import { useLocation } from 'react-router-dom';


function Home() {

  const location = useLocation();
    

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    //const status = params.get("status");
    const message = params.get("message");
   // const planName = params.get("plan");
    if (message) {
      alert(message); // or show a toast/snackbar
    }
   
  }, [location]);
 
  return (
    
    <div>
        <DashBoardLayout/>
        <div className={styles.homeContent}>
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