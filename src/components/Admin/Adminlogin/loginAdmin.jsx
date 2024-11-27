import React from 'react'
import Login from '../Adminlogin/Login'
import logo from "../../../assets/images/images/logo-2.svg";
 

const AuthenticationSectionAdmin = () => {

  return (
    <section className="fz-account-form-section mt-top-0">
        <div className="container forming">
            <div className="row g-4 justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-12 col-12 col-xxs-12">
                    <img src={logo} alt="" srcset="" className='logo-img'/>
                    <p className="welcome">Welcome to Caratree Admin Login</p>
                    <Login/>
                </div>
               
            </div>
        </div>
    </section>
    
  )
}

export default AuthenticationSectionAdmin