import React from "react";
import CustomViewOrder from "../../components/Admin/CustomeOrders/ViewOrder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ViewCustumOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <CustomViewOrder />
      
    </>
  );
};

export default ViewCustumOrdersPage;
