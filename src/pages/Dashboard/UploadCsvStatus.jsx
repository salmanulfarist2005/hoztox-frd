import React from "react";
import StatusCSVUpload from "../../components/Admin/CustomeOrders/UploadCsvStatus";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import './Hoztox.css';


const StatusCustumOrdersPage = () => {
  return (
    <>
      <Sidebar /> 
      <Header/>         
      <StatusCSVUpload />
      
    </>
  );
};

export default StatusCustumOrdersPage;
