import React from "react";
import FullStatus from "../../components/Admin//FullCustomOrders/FullStataus";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const StatusFullOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <FullStatus />
      
    </>
  );
};

export default StatusFullOrdersPage;
