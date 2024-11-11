import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [search, setsearch] = useState(false);

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collapsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box text-center">
              
            </div>

            <div className="hidedesk">
            <button
              type="button"
              className=" btn btn-sm px-3 font-size-24 header-item waves-effect"
              id="vertical-menu-btn"
              onClick={() => {
                tToggle();
              }}
            >
             MENU <i className="ri-menu-2-line align-middle"></i>
            </button>
            </div>

            {/* <form className="app-search d-none d-lg-block"> 
              <div className="position-relative">
                <input type="text" className="form-control" placeholder="Search..." />
                <span className="ri-search-line"></span>
              </div>
            </form> */}
          </div>

          {/* <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setsearch(!search);
                }}
                type="button"
                className="btn header-item noti-icon"
                id="page-header-search-dropdown"
              >
                <i className="ri-search-line" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0"> 
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="ri-search-line" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon"
                data-toggle="fullscreen"
              >
                <i className="ri-fullscreen-line" />
              </button>
            </div>
          </div> */}
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
