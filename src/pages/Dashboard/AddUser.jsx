import React from "react";
import AddUser from "../../components/Admin/User/AddUser";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const AddUserPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <AddUser />
      
    </>
  );
};

export default AddUserPage;
