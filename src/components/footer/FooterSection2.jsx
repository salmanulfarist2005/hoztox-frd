import React from "react";
import { Link } from "react-router-dom";

const FooterSection2 = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="fz-2-footer-section">
      <div className="fz-footer-top">
        <div className="container">
          <div className="row gy-5 justify-content-center">
            <div className="col-xl-3 col-lg-6 col-md-8">
              <div className="fz-footer-about">
                <div className="fz-logo">
                  <Link to="/home">
                    <img src="https://portal.caratreediamonds.com/assets/images/logo-2.svg" alt="logo" />
                  </Link>
                </div> 
                 </div>
            </div>
            </div>
        </div>
      </div>

      <div className="fz-footer-bottom">
        <div className="container">
          <div className="row gy-4 align-items-center">
            <div className="col-lg-12">
              <p className="fz-copyright text-center">
                &copy;
                {currentYear} CARATREE DIAMONDS All Rights Reserved. </p>
            </div>

            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection2;
