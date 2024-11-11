import React from "react";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../../src/Layout/VerticalLayout/Header";
import Dashboard from "../../components/Admin/Dashboard/index";





const DashboardPage = () => {
  return (
    <>
      <Dashboard />

      <Sidebar />
      <Header />
    </>
  );
};

export default DashboardPage;
