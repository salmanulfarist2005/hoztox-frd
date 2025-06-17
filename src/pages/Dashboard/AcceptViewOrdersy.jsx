import React from "react";
import ViewOrderAccept from "../../components/Admin/Orders/ViewOrdersAccept";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const AcceptViewOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <ViewOrderAccept />
      
    </>
  );
};

export default AcceptViewOrdersPage;
