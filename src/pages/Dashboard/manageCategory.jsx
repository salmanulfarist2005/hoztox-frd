import React from "react";
import ManageCategory from "../../components/Admin/Categories/ManageCategory";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ManageCategoryPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ManageCategory/>
      
    </>
  );
};

export default ManageCategoryPage;
