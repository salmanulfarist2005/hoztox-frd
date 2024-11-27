import React from 'react'
import SignInFormSection from '../forms/SignInFormSection'
import logo from "../../assets/images/images/logo-2.svg";
 

const AuthenticationSection = () => {

  return (
    <section className="fz-account-form-section mt-top-0">
        <div className="container forming">
            <div className="row g-4 justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-12 col-12 col-xxs-12">
                    <img src={logo} alt="" srcset="" className='logo-img'/>
                    <SignInFormSection/>
                </div>
            </div>
        </div>
    </section>
    
  )
}

export default AuthenticationSection