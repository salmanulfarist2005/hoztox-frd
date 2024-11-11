import React from "react";
import AddCategory from "../../components/Admin/Categories/AddCategory";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const AddCategoryPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <AddCategory />
      
    </>
  );
};

export default AddCategoryPage;
