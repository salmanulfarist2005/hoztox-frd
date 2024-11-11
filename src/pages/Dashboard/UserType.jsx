import React from "react";
import UserType from "../../components/Admin/User/UserType";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const UserTypePage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <UserType />
      
    </>
  );
};

export default UserTypePage;
