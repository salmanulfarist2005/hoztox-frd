import React from "react";
import AddCustomeProduct from "../../components/Admin/Customizedproducts/AddCustomizedProducts";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const AddCustomizedProductsPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <AddCustomeProduct />
      
    </>
  );
};

export default AddCustomizedProductsPage;
