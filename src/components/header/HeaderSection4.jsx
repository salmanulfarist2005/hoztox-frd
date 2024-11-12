// HeaderSection4.jsx

import React, { useContext, useState, useEffect } from "react";
import HeaderNav from "../navigation/HeaderNav";
import { FarzaaContext } from "../../context/FarzaaContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from '../helpers/config';
import "./header.css";

const HeaderSection4 = () => {
  const { handleCartShow, isHeaderFixed, handleSidebarOpen, setCartItemAmount } = useContext(FarzaaContext);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jeweleryCartItemAmount, setJeweleryCartItemAmount] = useState(0);

 

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/products/cart-items/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Cart API response:", response.data);   

    
      setJeweleryCartItemAmount(response.data.length);  
      // fetchCartItems();
      setCartItemAmount(cartItemCount);  
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setJeweleryCartItemAmount(0);  
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn,]);
  return (
    <header className={`fz-header-section fz-2-header-section to-be-fixed ${isHeaderFixed ? "fixed" : ""}`}>
      <div className="row m-0 align-items-center">
        <div className="col-lg-4 col-md-6 col-9">
          <div className="fz-header-left-content d-flex align-items-center">
            <Link to="/">
              <img src="../assets/images/logo-2.png" alt="logo" className="fz-logo" />
            </Link>
          </div>
        </div>

        <div className="col-6 header-nav-container order-3 order-lg-2">
          <HeaderNav position={"justify-content-end"} />
        </div>

        <div className="col-lg-2 col-md-6 col-3 order-2 order-lg-3">
          <div className="fz-header-right-content">
            <ul className="fz-header-right-actions d-flex align-items-center justify-content-end">
              <Link to="/cart">
                <li>
                  <a role="button" className="fz-header-cart-btn d-none d-lg-block" onClick={handleCartShow}>
                    <i className="fa-light fa-cart-shopping"></i>
                    <span className="count">{jeweleryCartItemAmount}</span>
                  </a>
                </li>
              </Link>

              <li className="dropdown">
                {isLoggedIn ? (
                  <>
                    <button onClick={toggleDropdown} className="d-none d-lg-block" aria-expanded={dropdownOpen}>
                      <i className="fa-light fa-user"></i>
                      <span>Profile</span>
                    </button>

                    {dropdownOpen && (
                      <div className="dropdown-menu show">
                        <Link to="/my-orders" className="dropdown-item">
                          <i className="fa-light fa-box"></i>
                          <span>My Orders</span>
                        </Link>
                        <Link to="/profile" className="dropdown-item">
                          <i className="fa-light fa-user"></i>
                          <span>My Profile</span>
                        </Link>
                        <button onClick={handleLogout} className="dropdown-item" style={{ cursor: "pointer" }}>
                          <i className="fa-light fa-sign-out"></i>
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/account" className="d-none d-lg-block">
                    <i className="fa-light fa-user"></i>
                    <span>Login</span>
                  </Link>
                )}
              </li>

              <li>
                <a role="button" onClick={handleSidebarOpen} className="fz-hamburger d-block d-lg-none">
                  <i className="fa-light fa-bars-sort"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection4;
