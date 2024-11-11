import React from "react";
import FullCustomViewOrder from "../../components/Admin//FullCustomOrders/Vieworder";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ViewFullOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <FullCustomViewOrder />
      
    </>
  );
};

export default ViewFullOrdersPage;
