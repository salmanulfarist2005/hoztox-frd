import React from "react";
import CustomManageOrder from "../../components/Admin/CustomeOrders/ManageOrder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ManageFullCustumOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <CustomManageOrder />
      
    </>
  );
};

export default ManageFullCustumOrdersPage;
