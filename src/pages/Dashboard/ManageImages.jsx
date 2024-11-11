import React from "react";
import ManageImage from "../../components/Admin/Media/ManageImages";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ManagemagePage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ManageImage/>
      
    </>
  );
};

export default ManagemagePage;
