import React from "react";
import ManageProducts from "../../components/Admin/Products/ManageProducts";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ManageProductPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ManageProducts />
      
    </>
  );
};

export default ManageProductPage;
