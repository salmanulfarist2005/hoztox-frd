import React from "react";
import FullCustomPendingOrder from "../../components/Admin//FullCustomOrders/Pendingorder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const PendingFullOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <FullCustomPendingOrder />
      
    </>
  );
};

export default PendingFullOrdersPage;
