import { useContext } from "react";
import MobileMenuSection from "../mobile-menu/MobileMenuSection";
import { Link, useNavigate } from "react-router-dom";
import { FarzaaContext } from "../../context/FarzaaContext";

const RightSideBar = ({ showMenu }) => {
  const { isSidebarOpen, handleSidebarClose } = useContext(FarzaaContext);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to close the modal and navigate
  const closeAndNavigate = (path) => {
    handleSidebarClose();
    navigate(path);
  };
  return (
    <div
      className={`fz-offcanvas-main-nav-wrapper ${isSidebarOpen ? "open" : ""}`}
    >
      <button className="fz-button-close" onClick={handleSidebarClose}>
        <i className="fa-thin fa-xmark"></i>
      </button>
      <div className="fz-offcanvas-main-nav-wrapper-sections">
        <div
          className={`fz-offcanvas-main-nav-section ${showMenu ? "show" : ""}`}
        >
          <div
            className={`mobile-menu-updated ${
              isSidebarOpen ? "mean-container" : ""
            }`}
          >
            <MobileMenuSection navigate={closeAndNavigate} />
          </div>
        </div>
     
      </div>
    </div>
  );
};

export default RightSideBar;
