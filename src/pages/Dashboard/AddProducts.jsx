import React from "react";
import AddProduct from "../../components/Admin/Products/AddProducts";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const AddProductPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <AddProduct />
      
    </>
  );
};

export default AddProductPage;
