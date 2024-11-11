import React from "react";
import CustomPendingOrder from "../../components/Admin/CustomeOrders/PendingOrder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const PendingCustumOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <CustomPendingOrder />
      
    </>
  );
};

export default PendingCustumOrdersPage;
