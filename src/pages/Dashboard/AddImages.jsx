import React from "react";
import Media from "../../components/Admin/Media/AddImages";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const AddImagePage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <Media/>
      
    </>
  );
};

export default AddImagePage;
