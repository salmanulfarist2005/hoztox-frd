import React from "react";
import CompletedOrder from "../../components/Admin/Orders/CompletedOrder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const CompletedNOrder = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <CompletedOrder/>
      
    </>
  );
};

export default CompletedNOrder;
