import React from 'react';
import "./css/login.css";
import { auth, provider } from './firebase';
import { useStateValue } from './StateProvider';


const Login = () => {

  const [{},dispatch] = useStateValue();
  const GooglesignIn = ()=>{
    auth.signInWithPopup(provider).then(result=>{
      dispatch({
        type: "SET_USER",
        user: result.user
      })
    }).catch(error=>alert(error))
  }



  return (
    <>
      <div className="login__wrapper">   
        <div className="login">
            <img src="https://i2.wp.com/www.titanui.com/wp-content/uploads/2014/02/03/iOS-Chat-App-Icon-PSD.png" alt="Not loading" />
            <h2>Sign in</h2>
            <button onClick={GooglesignIn}>Login with Gmail</button>
        </div> 
      </div>
    </>
  )
}

export default Login;