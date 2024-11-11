import React from "react";
import ManageOrder from "../../components/Admin/Orders/MnageOrders";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const MnageOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ManageOrder />
      
    </>
  );
};

export default MnageOrdersPage;
