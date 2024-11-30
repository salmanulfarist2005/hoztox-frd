import React from "react";
import CompletedOrder from "../../components/Admin/FullCustomOrders/CompletedOrder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../Layout/VerticalLayout/Header";
import './Hoztox.css';


const CompletedCustumOrdersFullPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <CompletedOrder/>
      
    </>
  );
};

export default CompletedCustumOrdersFullPage;
