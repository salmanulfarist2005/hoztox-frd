import React from "react";
import ManageUser from "../../components/Admin/User/ManageUser";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ManageUserPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ManageUser />
      
    </>
  );
};

export default ManageUserPage;
