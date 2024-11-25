import React, { useContext, useState, useEffect } from "react"; 
import HeaderNav from "../navigation/HeaderNav";
 
import CartModal from "../modal/CartModal";
import HeaderCategoryArea from "./HeaderCategoryArea";
import { FarzaaContext } from "../../context/FarzaaContext";
import { Link } from "react-router-dom";
import "./header.css";
import { BASE_URL } from '../helpers/config';
import axios from 'axios';

const HeaderSection3 = () => {
  const {
    handleWishlistShow,
    handleCartShow,
    isHeaderFixed,
    handleSidebarOpen,
  } = useContext(FarzaaContext);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jeweleryCartItemAmount, setJeweleryCartItemAmount] = useState(0);  

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setJeweleryCartItemAmount(0); 
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    if (token) {
      fetchCartItems(); 
    }
  }, [isLoggedIn]);  

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${BASE_URL}/products/cart-items/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJeweleryCartItemAmount(response.data); 
      console.error('response.data', response.data);
      // fetchCartItems(); 
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => {
      console.log("Dropdown Open State:", !prev);
      return !prev;
    });
  };

  return (
    <header className={`fz-header-section fz-2-header-section to-be-fixed ${isHeaderFixed ? "fixed" : ""}`}>
      <div className="row m-0 align-items-center">
        <div className="col-lg-4 col-md-6 col-9">
          <div className="fz-header-left-content d-flex align-items-center">
            <div className="fz-logo-container logo-top">
              <Link to="/home">
                <img src="../assets/images/logo-2.svg" alt="logo" className="fz-logo" />
              </Link>
            </div>
            <HeaderCategoryArea header={""} title={""} />
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
                  <a
                    role="button"
                    className="fz-header-cart-btn d-none d-lg-block"
                    onClick={handleCartShow}
                  >
                    <i className="fa-light fa-cart-shopping"></i>
                    <span className="count">{jeweleryCartItemAmount}</span>
                  </a>
                </li>
              </Link>

              <li className="dropdown">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={toggleDropdown}
                      className="d-none d-lg-block"
                      aria-expanded={dropdownOpen}
                    >
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
                        <button
                          onClick={handleLogout}
                          className="dropdown-item"
                          style={{ cursor: 'pointer' }}
                        >
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
                <a
                  role="button"
                  onClick={handleSidebarOpen}
                  className="fz-hamburger d-block d-lg-none"
                >
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

export default HeaderSection3;
