import React from "react";
import Outview from "../../components/Admin/Orders/outview";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const OutviewPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <Outview />
      
    </>
  );
};

export default OutviewPage;
