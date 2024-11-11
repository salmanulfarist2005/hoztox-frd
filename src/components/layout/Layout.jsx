import React from "react";
import HeaderSection4 from "../header/HeaderSection4";
import FooterSectioninner from "../footer/FooterSection-inner";
import RightSideBar from "../sidebar/RightSideBar";

const Layout = ({ children }) => {
  return (
    <>
      <HeaderSection4 />
      
      {children}
      <RightSideBar />
      <FooterSectioninner />
    </>
  );
};

export default Layout;
