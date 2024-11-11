import React from "react";
import ChangePassword from "../../components/Admin/Management/Changepassword";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ChangepasswordPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ChangePassword />
      
    </>
  );
};

export default ChangepasswordPage;
