import React from "react";
import FullCustomManageOrder from "../../components/Admin//FullCustomOrders/ManageOrder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ManageFullOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <FullCustomManageOrder />
      
    </>
  );
};

export default ManageFullOrdersPage;
