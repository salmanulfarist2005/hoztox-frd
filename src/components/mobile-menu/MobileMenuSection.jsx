import React, { useContext } from "react";
import { FarzaaContext } from "../../context/FarzaaContext";
import { Link } from "react-router-dom";
const MobileMenuSection = ({ navigate }) => {
  const { isDropdownOpen, handleDropdownToggle } = useContext(FarzaaContext);
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
            <a role="button" className="fz-nav-link">
              <span>Home</span>
               
            </a>
            </Link>
          </div>
           
          <div className="fz-dropdown fz-nav-item">
          <Link to="/shop">
            <a role="button" className="fz-nav-link">
              <span>Products</span>
         
            </a>
            </Link>
            
               
          </div>
          <div className="fz-dropdown fz-nav-item">
          <Link to="/custom-shop">
            <a role="button" className="fz-nav-link">
              <span>Customized Products</span>
        
            </a>
            </Link>
            
          </div>
          <div className="fz-nav-item mean-last">
          <Link to="/contact">
            <a
              role="button"
              // onClick={() => navigate("/contact")}
              className="fz-nav-link"
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
