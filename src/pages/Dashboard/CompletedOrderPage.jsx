import React from "react";
import CompletedOrder from "../../components/Admin/CustomeOrders/CompletedOrder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const CompletedCustumOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <CompletedOrder/>
      
    </>
  );
};

export default CompletedCustumOrdersPage;
