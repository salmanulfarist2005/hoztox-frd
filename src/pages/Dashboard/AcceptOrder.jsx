import React from "react";
import AcceptOrder from "../../components/Admin/Orders/AcceptOrder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const AcceptOrderPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <AcceptOrder/>
      
    </>
  );
};

export default AcceptOrderPage;
