import React from "react";
import AddColor from "../../components/Admin/AddColor/AddColor";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const AddColorPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <AddColor/>
      
    </>
  );
};

export default AddColorPage;
