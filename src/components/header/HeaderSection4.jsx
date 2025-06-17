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
  const navigate = useNavigate(); 

  const closeAndNavigate = (path) => {
    handleSidebarClose();
    navigate(path);
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        navigate('/');
    }   
  }, [navigate]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/products/cart-items/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setJeweleryCartItemAmount(response.data.length);  
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
    navigate("/")
  };

 
  useEffect(() => {
    const closeDropdown = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener('click', closeDropdown);
      return () => document.removeEventListener('click', closeDropdown);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn, setCartItemAmount]);

  return (
    <>
    
      <style jsx>{`
        .profile-dropdown {
          position: relative;
          display: inline-block;
        }



        .animated-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 200px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
          transform-origin: top right;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animated-dropdown.entering {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
          visibility: hidden;
        }

        .animated-dropdown.entered {
          opacity: 1;
          transform: scale(1) translateY(0);
          visibility: visible;
        }

        .animated-dropdown.exiting {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
          visibility: visible;
        }

        .dropdown-item-animated {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          text-decoration: none;
          color: #333;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
          gap: 12px;
        }

        .dropdown-item-animated:hover {
          background-color: #f8f9fa;
          color: #007bff;
          transform: translateX(4px);
        }

        .dropdown-item-animated i {
          width: 16px;
          opacity: 0.7;
          transition: all 0.2s ease;
        }

        .dropdown-item-animated:hover i {
          opacity: 1;
          transform: scale(1.1);
        }

        .dropdown-item-animated span {
          font-weight: 500;
        }

        .dropdown-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
          margin: 4px 0;
        }

        .logout-item {
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          margin-top: 4px;
        }

        .logout-item:hover {
          background-color: #fff5f5;
          color: #dc3545;
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item-animated {
          animation: slideInFromTop 0.3s ease forwards;
        }

        .dropdown-item-animated:nth-child(1) { animation-delay: 0.05s; }
        .dropdown-item-animated:nth-child(2) { animation-delay: 0.1s; }
        .dropdown-item-animated:nth-child(3) { animation-delay: 0.15s; }
        .dropdown-item-animated:nth-child(4) { animation-delay: 0.2s; }
      `}</style>

      <header className={`fz-header-section fz-2-header-section to-be-fixed ${isHeaderFixed ? "fixed" : ""}`}>
        <div className="row m-0 align-items-center">
          <div className="col-lg-4 col-md-6 col-9">
            <div className="fz-header-left-content d-flex align-items-center" style={{ width: '150px' }}>
              <Link to="/home">
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

                <li className="profile-dropdown">
                  {isLoggedIn ? (
                    <>
                      {/* Mobile Profile Button */}
                      <a className="d-lg-none fz-hamburger">
                        <button onClick={toggleDropdown} className=" d-lg-flex" aria-expanded={dropdownOpen}>
                          <i className="fa-light fa-user"></i>
                          <span className="d-none d-lg-block" >Profile</span>
                        </button>
                      </a>

                      {/* Desktop Profile Button */}
                      <a className="d-none d-lg-block">
                        <button onClick={toggleDropdown} className=" d-lg-flex" aria-expanded={dropdownOpen}>
                          <a className="fz-hamburger " title="Profile">
                            <i className="fa-light fa-user"></i>
                            {/* <span className="d-none d-lg-block" >Profile</span> */}
                          </a>
                        </button>
                      </a>

                      {/* Animated Dropdown Menu */}
                      <div className={`animated-dropdown ${dropdownOpen ? 'entered' : 'entering'}`}>
                        <Link to="/my-orders" className="dropdown-item-animated">
                          <i className="fa-light fa-box"></i>
                          <span>My Orders</span>
                        </Link>
                        
                        <Link to="/my-delivered-orders" className="dropdown-item-animated">
                          <i className="fa-light fa-check-circle"></i>
                          <span>Delivered Orders</span>
                        </Link>
                        
                        <Link to="/profile" className="dropdown-item-animated">
                          <i className="fa-light fa-user"></i>
                          <span>My Profile</span>
                        </Link>
                        
                        <div className="dropdown-divider"></div>
                        
                        <button 
                          onClick={handleLogout} 
                          className="dropdown-item-animated logout-item"
                        >
                          <i className="fa-light fa-sign-out"></i>
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link to="/account" className="d-lg-block">
                      <a className="fz-hamburger" title="Login">
                        <i className="fa-light fa-lock"></i>
                      </a>
                    </Link>
                  )}
                </li>

                <li>
                  <Link to="/cart" className="d-lg-none">
                    <a className="fz-hamburger relative fz-header-cart-btn1" role="button" onClick={handleCartShow}>
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
    </>
  );
};

export default HeaderSection4;