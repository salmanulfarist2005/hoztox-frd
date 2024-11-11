import React from "react";
import ProductCSVUpload from "../../components/Admin/Products/AddProductCsv";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ProductCSVUploadPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ProductCSVUpload />
      
    </>
  );
};

export default ProductCSVUploadPage;
