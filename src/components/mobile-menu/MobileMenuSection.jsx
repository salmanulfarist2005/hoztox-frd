import React, { useContext, useState, useEffect } from "react";
import { FarzaaContext } from "../../context/FarzaaContext";
import { Link ,useNavigate} from "react-router-dom";
const MobileMenuSection = ( ) => {
 
  const { isSidebarOpen, handleSidebarClose } = useContext(FarzaaContext);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to close the modal and navigate
  const closeAndNavigate = (path) => {
    handleSidebarClose();
    navigate(path);
  };

  return (
    <div className="mean-bar">
      <a href="#nav" className="meanmenu-reveal">
        <span>
          <span>
            <span></span>
          </span>
        </span>
      </a>
      <nav className="mobile-mean-nav">
        <div className="mobile-menu-list-items">
          <div className="fz-dropdown fz-nav-item">
          <Link to="/">
            <a role="button" className="fz-nav-link"onClick={() => closeAndNavigate("/")}>
              <span>Home</span>
               
            </a>
            </Link>
          </div>
           
          <div className="fz-dropdown fz-nav-item">
          <Link to="/shop">
            <a role="button" className="fz-nav-link"  onClick={() => closeAndNavigate("/shop")}>
              <span>Products</span>
         
            </a>
            </Link>
            
               
          </div>
          <div className="fz-dropdown fz-nav-item">
          <Link to="/custom-shop">
            <a role="button" className="fz-nav-link"  onClick={() => closeAndNavigate("/custom-shop")}>
              <span>Customized Products</span>
        
            </a>
            </Link>
            
          </div>
          <div className="fz-nav-item mean-last">
          <Link to="/contact">
            <a
              role="button"
              // onClick={() => navigate("/contact")}
              className="fz-nav-link" onClick={() => closeAndNavigate("/contact")}
            >
              Contact
            </a>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenuSection;
