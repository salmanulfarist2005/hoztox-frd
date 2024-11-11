import React from "react";
import ViewOrder from "../../components/Admin/Orders/ViewOrders";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const ViewOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ViewOrder />
      
    </>
  );
};

export default ViewOrdersPage;
