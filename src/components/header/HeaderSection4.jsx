// HeaderSection4.jsx

import React, { useContext, useState, useEffect } from "react";
import HeaderNav from "../navigation/HeaderNav";
import { FarzaaContext } from "../../context/FarzaaContext";
import axios from "axios";
import { BASE_URL } from '../helpers/config';
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
const HeaderSection4 = () => {
  const { handleCartShow, isHeaderFixed, handleSidebarOpen, setCartItemAmount } = useContext(FarzaaContext);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jeweleryCartItemAmount, setJeweleryCartItemAmount] = useState(0);

  const { isSidebarOpen, handleSidebarClose } = useContext(FarzaaContext);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to close the modal and navigate
  const closeAndNavigate = (path) => {
    handleSidebarClose();
    navigate(path);
  };

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
  }, [isLoggedIn]);
  return (
    <header className={`fz-header-section fz-2-header-section to-be-fixed ${isHeaderFixed ? "fixed" : ""}`}>
      <div className="row m-0 align-items-center">
        <div className="col-lg-4 col-md-6 col-9">
        <div className="fz-header-left-content d-flex align-items-center" style={{ width: '150px' }}>
            <Link to="/">
              <img src="../assets/images/logo-2.svg" alt="logo" className="fz-logo" />
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
                    <a className="d-lg-none fz-hamburger">
                    <button onClick={toggleDropdown} className=" d-lg-flex" aria-expanded={dropdownOpen}>
                      <i className="fa-light fa-user"></i>
                      <span className="d-none d-lg-block" >Profile</span>
                    </button>
                    </a>

                    <a className="d-none d-lg-block">
                    <button onClick={toggleDropdown} className=" d-lg-flex" aria-expanded={dropdownOpen}>
                      <i className="fa-light fa-user"></i>
                      <span className="d-none d-lg-block" >Profile</span>
                    </button>
                    </a>

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
                  <Link to="/account" className="d-lg-block">
                    <i className="fa-light fa-user"></i>
                    <span>Login</span>
                  </Link>
                )}
              </li>

               <li>
               <Link to="/cart" className="d-lg-none">
               <a className="fz-hamburger relative fz-header-cart-btn1" role="button"  onClick={handleCartShow}>
             
                <span className="fz-off-actions-icon">
                  <i className="fa-thin fa-bag-shopping"></i>
                </span>
                <span className="count">{jeweleryCartItemAmount}</span>
                
              </a>
              </Link>
             

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
