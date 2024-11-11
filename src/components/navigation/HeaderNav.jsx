import React from "react";
import { Link } from "react-router-dom";

const HeaderNav = ({ position, downArrow }) => {
  return (
    <nav className="fz-header-nav">
      <ul className={`align-items-center ${position}`}>
      <Link to="/">
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>home</span>{" "}
            
          </a>

           
        </li>
        </Link>
        <Link to="/shop">
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Products</span>{""}
             
          </a>

          
        </li>
        </Link>
        <Link to="/custom-shop">
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Customized Products</span>{" "}
            
          </a>

          
        </li>
        </Link>

        <Link to="/contact">
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Contact</span>{" "}
            
          </a>

          
        </li>
        </Link>
      </ul>
    </nav>
  );
};

export default HeaderNav;
