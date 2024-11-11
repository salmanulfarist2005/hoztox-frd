import React from "react";
import ManageCustomProducts from "../../components/Admin/Customizedproducts/ManageCustomizedProducts";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ManageCustomizedProductsPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ManageCustomProducts />
      
    </>
  );
};

export default ManageCustomizedProductsPage;
